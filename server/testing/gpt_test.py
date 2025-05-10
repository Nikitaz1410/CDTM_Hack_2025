import base64
from openai import OpenAI
from dotenv import load_dotenv
import os
from server.image_engine.schematas import Blutbild
from server.image_engine.system_prompts import blutbild_prompt

# Load environment variables from .env
load_dotenv()

# Get API key
api_key = os.getenv("OPENAI_API_KEY")

# Initialize OpenAI client with the key
client = OpenAI(api_key=api_key)

# Function to encode the image
def encode_image(image_path):
    with open(image_path, "rb") as image_file:
        return base64.b64encode(image_file.read()).decode("utf-8")


# Path to your image
IMAGE_PATH = "../data/PXL_20250509_215016645.jpg"

# Getting the Base64 string
base64_image = encode_image(IMAGE_PATH)


response = client.responses.parse(
    model="gpt-4.1",
    text_format=Blutbild,
    input=[
        {   "role": "system", "content": blutbild_prompt},
        {
            "role": "user",
            "content": [
                {
                    "type": "input_image",
                    "image_url": f"data:image/jpeg;base64,{base64_image}",
                },
            ],
        }
    ],
)

print(dict(response.output_parsed))
#print(response.output_parsed.model_dump_json(indent=2))