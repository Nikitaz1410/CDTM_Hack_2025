import base64
from openai import OpenAI
from dotenv import load_dotenv
import os
from server.image_engine.schematas import *
from server.image_engine.system_prompts import *

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
            model="o4-mini",
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

        return response.output_parsed.model_dump_json(indent=2)

if __name__ == "__main__":
    anal = ImageAnalyzer()
    image_path = "../data/impfpass1.jpg"
    with open(image_path, "rb") as image_file:
        image = image_file.read()
    print(anal.run(Impfpass, impfpass_prompt, image))

