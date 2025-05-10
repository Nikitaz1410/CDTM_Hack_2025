from flask import Flask, request, jsonify
import os

app = Flask(__name__)

@app.route('/process_image', methods=['POST'])
def process_image():
    """
    Endpoint that accepts an image upload and returns a dummy JSON response
    """
    # Check if image file is present in the request
    if 'image' not in request.files:
        return jsonify({
            'error': 'No image file provided',
            'status': 'error'
        }), 400

    file = request.files['image']
    filepath = "uploads/test"
    file.save(filepath)

    # Return dummy JSON response
    return jsonify({
        'status': 'success',
        'message': 'Image successfully received',
        'dummy_data': {
            'processed': True,
            'analysis_result': 'This is a dummy analysis result',
        }
    }), 200


if __name__ == '__main__':
    # Create uploads directory if it doesn't exist
    if not os.path.exists('uploads'):
        os.makedirs('uploads')

    app.run(debug=True, host='0.0.0.0', port=5000)