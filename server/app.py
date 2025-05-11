from fastapi import FastAPI, File, UploadFile, HTTPException, Form
from fastapi.responses import JSONResponse
from fastapi.middleware.cors import CORSMiddleware
import os
from datetime import datetime
import base64
import mimetypes

from server.connection.api_requests import JavaAPIClient
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
api_client = JavaAPIClient()

# Create upload directory if it doesn't exist
UPLOAD_FOLDER = 'uploads'
if not os.path.exists(UPLOAD_FOLDER):
    os.makedirs(UPLOAD_FOLDER)

# DAS IST DEIN ENDPOINT SEBI
# document can be one of the following: blutbild, impfpass, befund, medikation, other
@app.post('/api-img/upload-document')
async def upload_document(
        image: UploadFile = File(...),  # Explicitly use File, (...) means required
        userId: int = Form(...),        # Expect userId as form data, required
        document: str = Form("other"),  # Expect document as form data, with default
):
    try:
        # Check if file is provided (FastAPI handles this with File(...))
        if not image.filename:
            # This check might be redundant if image is File(...)
            raise HTTPException(status_code=400, detail="No file selected or filename missing")

        # Read the image data
        image_data = await image.read()

        # Map to correct document type
        if document not in mapping(api_client): # Use mapping(api_client) here
            raise HTTPException(status_code=400, detail=f"Unknown document type: {document}")

        schema, system_prompt, function = mapping(api_client)[document] # Use mapping(api_client) here
        analysis = image_model.run(schema, system_prompt, image_data)
        function(userId, analysis)

        # Example response
        response_data = {
            'success': True,
            'message': 'Document uploaded successfully'
        }

        return JSONResponse(content=response_data, status_code=200)

    except HTTPException:
        raise # Re-raise HTTPException if it's already one
    except Exception as e:
        # Log the full error for debugging on the server
        print(f"Unhandled error in upload_document: {type(e).__name__} - {e}")
        import traceback
        traceback.print_exc()
        raise HTTPException(status_code=500, detail=f'Failed to upload document: {str(e)}')

# Add this to server/app.py

# Health check endpoint
@app.get('/api-img/health')
async def health_check():
    return {
        'status': 'healthy',
        'service': 'document_analysis',
        'version': '1.0.0'
    }

# Root endpoint for basic server status
@app.get('/api-img/')
async def root():
    return {
        'message': 'AVI Health Document Analysis API',
        'status': 'running',
        'endpoints': {
            'upload': '/api-img/upload-document',
            'health': '/api-img/health'
        }
    }

if __name__ == '__main__':
    import uvicorn

    uvicorn.run(app, host="127.0.0.1", port=5000)