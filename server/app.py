# server/server.py (Your Flask server)
from flask import Flask, request, jsonify
from flask_cors import CORS
import os
from datetime import datetime
import base64

app = Flask(__name__)
CORS(app)  # Enable CORS for all routes

# Create upload directory if it doesn't exist
UPLOAD_FOLDER = 'uploads'
if not os.path.exists(UPLOAD_FOLDER):
    os.makedirs(UPLOAD_FOLDER)


@app.route('/api/upload-document', methods=['POST'])
def upload_document():
    try:
        # Check if image file is present
        if 'image' not in request.files:
            return jsonify({
                'error': 'No image file provided'
            }), 400

        file = request.files['image']

        # Check if file has a filename
        if file.filename == '':
            return jsonify({
                'error': 'No file selected'
            }), 400

        # Get additional metadata
        timestamp = request.form.get('timestamp', datetime.now().isoformat())
        user_id = request.form.get('userId', 'unknown')
        document_type = request.form.get('documentType', 'general')

        # Generate unique filename
        timestamp_str = datetime.now().strftime('%Y%m%d_%H%M%S')
        filename = f"{user_id}_{timestamp_str}_{file.filename}"
        filepath = os.path.join(UPLOAD_FOLDER, filename)

        # Save the file
        file.save(filepath)

        # Here you can add additional processing:
        # - OCR processing using tesseract or similar
        # - Image analysis
        # - Store metadata in database
        # - Extract text from document

        # Example response
        response_data = {
            'success': True,
            'message': 'Document uploaded successfully',
            'filename': filename,
            'filepath': filepath,
            'timestamp': timestamp,
            'userId': user_id,
            'documentType': document_type,
            'size': os.path.getsize(filepath),
            # You can add extracted text here later
            # 'extractedText': extracted_text,
            # 'analysis': analysis_results
        }

        return jsonify(response_data), 200

    except Exception as e:
        return jsonify({
            'error': f'Failed to upload document: {str(e)}'
        }), 500


@app.route('/api/documents', methods=['GET'])
def get_documents():
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

        return jsonify(documents), 200
    except Exception as e:
        return jsonify({
            'error': f'Failed to get documents: {str(e)}'
        }), 500


@app.route('/api/document/<filename>', methods=['GET'])
def get_document(filename):
    """Get specific document"""
    try:
        filepath = os.path.join(UPLOAD_FOLDER, filename)
        if os.path.exists(filepath):
            with open(filepath, 'rb') as f:
                file_data = f.read()

            # Return base64 encoded image data
            import mimetypes
            mime_type = mimetypes.guess_type(filepath)[0] or 'application/octet-stream'
            encoded = base64.b64encode(file_data).decode('utf-8')

            return jsonify({
                'filename': filename,
                'mimeType': mime_type,
                'data': f'data:{mime_type};base64,{encoded}'
            }), 200
        else:
            return jsonify({
                'error': 'Document not found'
            }), 404
    except Exception as e:
        return jsonify({
            'error': f'Failed to get document: {str(e)}'
        }), 500


if __name__ == '__main__':
    app.run(debug=True, port=5000)