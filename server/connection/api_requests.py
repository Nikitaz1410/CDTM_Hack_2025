import requests
import json
from datetime import datetime
from typing import Dict, Any, Optional, List

# Configuration
JAVA_API_URL = 'https://localhost:8080'

class JavaAPIClient:
    def __init__(self):
        self.base_url = JAVA_API_URL
        self.session = requests.Session()

        # Set default headers
        self.session.headers.update({
            'Content-Type': 'application/json',
            'Accept': 'application/json'
        })

        self.session.verify = False  # Disable SSL verification for localhost
        import urllib3
        urllib3.disable_warnings(urllib3.exceptions.InsecureRequestWarning)

    def save_impfung(self, user_id: int, data) -> Optional[Dict]:
        for impfung in data['impfungen']:
            try:
                impf_data = {
                    "name": impfung['Impfstoffname'],
                    "disease": impfung['Krankheit'],
                    "date": impfung['Impfdatum']
                }

                url = f"{self.base_url}/api/vaccinations/user/{user_id}"
                response = self.session.post(url, json=impf_data)

                # Check response
                if response.status_code == 200:
                    print(f"✓ Medication saved successfully for user {user_id}")
                    return response.json()
                else:
                    print(f"✗ Failed to save blood test: {response.status_code}")
                    print(f"  Response: {response.text}")
                    return None
            except requests.exceptions.RequestException as e:
                print(f"✗ Error calling Java API: {e}")
                return None

            except Exception as e:
                print(f"✗ Unexpected error: {e}")
                return None



    def save_medication(self, user_id: int, data) -> Optional[Dict]:
        for medi in data["medikamente"]:
            try:
                medi_data = {
                    "name": medi.get("name"),
                    "daily_intake": medi.get("daily_intake")
                }

                url = f"{self.base_url}/api/meds/user/{user_id}"
                response = self.session.post(url, json=medi_data)

                # Check response
                if response.status_code == 200:
                    print(f"✓ Medication saved successfully for user {user_id}")
                    return response.json()
                else:
                    print(f"✗ Failed to save blood test: {response.status_code}")
                    print(f"  Response: {response.text}")
                    return None

            except requests.exceptions.RequestException as e:
                print(f"✗ Error calling Java API: {e}")
                return None

            except Exception as e:
                print(f"✗ Unexpected error: {e}")
                return None

    def save_bloodtest(self, user_id: int, data) -> Optional[Dict]:
        """
        Save blood test data to Java backend

        Args:
            user_id: User ID for the blood test
            data: dict in this format:
            class BlutParam(BaseModel):
                name: str
                value: float

            class Blutbild(BaseModel):
                status: str
                date: str
                parameters: list[BlutParam]

        Returns:
            Response data from Java backend or None if failed
        """

        for metric in data["parameters"]:
            try:
                # Format data according to Java Blood entity
                blood_test_data = {
                    "date": data.get("date", datetime.now().strftime('%Y-%m-%d')),
                    "metric": metric["name"],
                    "value": metric["value"]
                }

                # Make POST request to Java endpoint
                url = f"{self.base_url}/api/blood/user/{user_id}"
                response = self.session.post(url, json=blood_test_data)

                # Check response
                if response.status_code == 200:
                    print(f"✓ Blood test saved successfully for user {user_id}")
                    return response.json()
                else:
                    print(f"✗ Failed to save blood test: {response.status_code}")
                    print(f"  Response: {response.text}")
                    return None

            except requests.exceptions.RequestException as e:
                print(f"✗ Error calling Java API: {e}")
                return None
            except Exception as e:
                print(f"✗ Unexpected error: {e}")
                return None



# Example for testing
if __name__ == "__main__":
    """
    class BlutParam(BaseModel):
                name: str
                value: float

            class Blutbild(BaseModel):
                status: str
                date: str
                parameters: list[BlutParam]
    """
    client = JavaAPIClient()

    # Test with sample data
    test_data = {
        "status": "success",
        "date": "2025-05-10",
        "medikamente": [
            {
                "name": "testo",
                "dailyIntake": 20
            },
        ]
    }

    result = client.save_medication(1, test_data)
    if result:
        print("Medication test saved successfully!")
        print(json.dumps(result, indent=2))
    else:
        print("Failed to save test")