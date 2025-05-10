import requests
import os

# Configuration
BASE_URL = "http://127.0.0.1:5000"  # Assuming your FastAPI app runs on default port
ENDPOINT = "/api/upload-document"
IMAGE_FILE_PATH = "/home/luca-bozzetti/Code/Hackathons/cdtm-hackathon/CDTM_Hack_2025/server/data/blutbild1.jpg" # Relative to where this script is run
USER_ID = 1
DOCUMENT_TYPE = "blutbild" # Or "other", "impfpass", etc., as needed for the test

def run_simple_upload_test():
    url = BASE_URL + ENDPOINT

    # Check if the image file exists
    if not os.path.exists(IMAGE_FILE_PATH):
        print(f"Error: Image file not found at {os.path.abspath(IMAGE_FILE_PATH)}")
        print("Please ensure the path is correct relative to where you are running this script.")
        return

    try:
        # 'files' dict: 'field_name': (filename, file_object, content_type)
        # 'image' is the name of the parameter in your FastAPI endpoint
        with open(IMAGE_FILE_PATH, 'rb') as image_file:
            files = {
                'image': (os.path.basename(IMAGE_FILE_PATH), image_file, 'image/jpeg') # Adjust content_type if not JPEG
            }
            # 'data' dict for other form fields
            data = {
                'userId': USER_ID,
                'document': DOCUMENT_TYPE
            }

            print(f"Sending POST request to: {url}")
            print(f"User ID: {USER_ID}")
            print(f"Document Type: {DOCUMENT_TYPE}")
            print(f"File: {IMAGE_FILE_PATH}")

            response = requests.post(url, files=files, data=data)

            # Print the response from the server
            print("\n--- Response ---")
            print(f"Status Code: {response.status_code}")
            try:
                print("JSON Response:")
                print(response.json())
            except requests.exceptions.JSONDecodeError:
                print("Response Content (not JSON):")
                print(response.text)

    except requests.exceptions.ConnectionError as e:
        print(f"\nError: Could not connect to the server at {BASE_URL}.")
        print("Please ensure your FastAPI application is running.")
        print(f"Details: {e}")
    except FileNotFoundError:
        # This is a redundant check as we check with os.path.exists earlier,
        # but good for completeness if the path was manipulated.
        print(f"Error: Image file not found at {IMAGE_FILE_PATH}")
    except Exception as e:
        print(f"\nAn unexpected error occurred: {e}")

if __name__ == "__main__":
    run_simple_upload_test()