import base64
from openai import OpenAI
from dotenv import load_dotenv
import os
from server.schematas import *
from server.system_prompts import *

class ImageAnalyzer:
    def __init__(self):
        # Load environment variables from .env
        load_dotenv()

        # Get API key
        api_key = os.getenv("OPENAI_API_KEY")

        # Initialize OpenAI client with the key
        self.client = OpenAI(api_key=api_key)

    @staticmethod
    def encode_image(image):
        return base64.b64encode(image).decode("utf-8")

    def run(self, schema, system_prompt, image):
        base64_image = self.encode_image(image)
        response = self.client.responses.parse(
            model="gpt-4.1",
            text_format=schema,
            input=[
                {"role": "system", "content": system_prompt},
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

        return response.output_parsed.model_dump_json()

if __name__ == "__main__":
    anal = ImageAnalyzer()
    image_path = "./data/PXL_20250509_215016645.jpg"
    with open(image_path, "rb") as image_file:
        image = image_file.read()
    print(anal.run(Blutbild, blutbild_prompt, image))

