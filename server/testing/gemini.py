from google import genai
from google.genai import types
from server.schematas import *

client = genai.Client(
    vertexai=True, project="avi-cdtm-hack-team-5730", location="global"
)

IMAGE_PATH = "/data/PXL_20250509_215016645.jpg"

# Read the image file
with open(IMAGE_PATH, 'rb') as f:
    image_data = f.read()

response = client.models.generate_content(
    model="gemini-2.0-flash-001",
    contents=[
        types.Part.from_bytes(
            data=image_data,
            mime_type='image/jpeg',
        ),
        'Please give this patient data a short caption. After that, Make a list of Parameters present in the Bloodtest, where each parameter has a name and a value (as float)'
    ],
    config={
        "response_mime_type": "application/json",
        "response_schema": Blutbild,
    },
)

print(response.text)