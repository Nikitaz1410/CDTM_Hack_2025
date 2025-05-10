from fastapi import FastAPI, File, UploadFile, HTTPException
from fastapi.responses import JSONResponse
from fastapi.middleware.cors import CORSMiddleware
import os
from datetime import datetime
import base64
import mimetypes

from server.image_engine.image_recognition import ImageAnalyzer
from server.image_engine.document_mapping import mapping

app = FastAPI()

# Add CORS middleware
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # In production, be more specific about origins
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

image_model = ImageAnalyzer()

# Create upload directory if it doesn't exist
UPLOAD_FOLDER = 'uploads'
if not os.path.exists(UPLOAD_FOLDER):
    os.makedirs(UPLOAD_FOLDER)

# DAS IST DEIN ENDPOINT SEBI
# document can be one of the following: blutbild, impfpass, befund, medikation, other
@app.post('/api/upload-document')
async def upload_document(
        image: UploadFile,
        userId: int,
        document: str = "other",
):
    try:
        # Check if file is provided
        if not image.filename:
            raise HTTPException(status_code=400, detail="No file selected")

        # Read the image data
        image_data = await image.read()

        # Map to correct document type
        if document not in mapping:
            raise HTTPException(status_code=400, detail=f"Unknown document type: {document}")

        schema, system_prompt = mapping[document]
        analysis = image_model.run(schema, system_prompt, image_data)
        print(analysis)

        # Generate unique filename
        timestamp_str = datetime.now().strftime('%Y%m%d_%H%M%S')
        filename = f"{timestamp_str}_{image.filename}"
        filepath = os.path.join(UPLOAD_FOLDER, filename)

        # Save the file
        with open(filepath, 'wb') as f:
            f.write(image_data)

        # Example response
        response_data = {
            'success': True,
            'message': 'Document uploaded successfully',
            'filename': filename,
            'filepath': filepath,
            'size': os.path.getsize(filepath),
            'analysis': analysis  # Include analysis results
        }

        return JSONResponse(content=response_data, status_code=200)

    except HTTPException:
        raise
    except Exception as e:
        raise HTTPException(status_code=500, detail=f'Failed to upload document: {str(e)}')


@app.get('/api/documents')
async def get_documents():
    """Get list of uploaded documents"""
    try:
        documents = []
        for filename in os.listdir(UPLOAD_FOLDER):
            if filename.endswith(('.jpg', '.jpeg', '.png', '.pdf')):
                filepath = os.path.join(UPLOAD_FOLDER, filename)
                stat = os.stat(filepath)
                documents.append({
                    'filename': filename,
                    'size': stat.st_size,
                    'uploaded_at': datetime.fromtimestamp(stat.st_mtime).isoformat(),
                    'url': f'/api/document/{filename}'
                })

        return JSONResponse(content=documents, status_code=200)
    except Exception as e:
        raise HTTPException(status_code=500, detail=f'Failed to get documents: {str(e)}')


@app.get('/api/document/{filename}')
async def get_document(filename: str):
    """Get specific document"""
    try:
        filepath = os.path.join(UPLOAD_FOLDER, filename)
        if os.path.exists(filepath):
            with open(filepath, 'rb') as f:
                file_data = f.read()

            # Return base64 encoded image data
            mime_type = mimetypes.guess_type(filepath)[0] or 'application/octet-stream'
            encoded = base64.b64encode(file_data).decode('utf-8')

            return JSONResponse(content={
                'filename': filename,
                'mimeType': mime_type,
                'data': f'data:{mime_type};base64,{encoded}'
            }, status_code=200)
        else:
            raise HTTPException(status_code=404, detail='Document not found')
    except HTTPException:
        raise
    except Exception as e:
        raise HTTPException(status_code=500, detail=f'Failed to get document: {str(e)}')


if __name__ == '__main__':
    import uvicorn

    uvicorn.run(app, host="127.0.0.1", port=5000)