import pytest
from fastapi.testclient import TestClient
import os

# Import your app
from server.app import app

# Create test client
client = TestClient(app)


def test_upload_document():
    """
    Test case for upload_document function with userid 1 and bluttest1.jpg
    """
    # Path to test image
    image_path = "../data/blutbild1.jpg"

    # Check if file exists
    assert os.path.exists(image_path), f"Test image not found at {image_path}"

    # Read the image file
    with open(image_path, "rb") as f:
        image_content = f.read()

    # FastAPI expects form data with the exact parameter names
    files = {
        "image": ("bluttest1.jpg", image_content, "image/jpeg")
    }

    # Pass other parameters as form data fields (strings!)
    data = {
        "userId": "1",  # Changed from 1 to "1"
        "document": "blutbild"
    }

    # Make the request
    response = client.post("/api/upload-document", files=files, data=data)

    # Debug: Print response details if it fails
    if response.status_code != 200:
        print(f"Status code: {response.status_code}")
        print(f"Response text: {response.text}")

    # Assert the response
    assert response.status_code == 200, f"Expected 200, got {response.status_code}"

    # Parse JSON response
    json_response = response.json()

    # Check response structure
    assert json_response["success"] == True
    assert "message" in json_response
    assert "filename" in json_response
    assert "filepath" in json_response
    assert "size" in json_response
    assert "analysis" in json_response

    print("Test passed!")
    print("Analysis result:", json_response["analysis"])


# Run the test
if __name__ == "__main__":
    test_upload_document()