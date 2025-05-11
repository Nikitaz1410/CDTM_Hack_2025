import requests
import json
from datetime import datetime
from typing import Dict, Any, Optional, List

# Configuration
JAVA_API_URL = 'http://localhost:9898'

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

    def save_report(self, user_id: int, data: Dict[str, Any]) -> Optional[Dict]:
        try:
            report_data = {
                "date": data['date'],
                "summary": data['summary'],
                "text": data['full_text'],
            }

            url = f"{self.base_url}/api/reports/user/{user_id}"
            response = self.session.post(url, json=report_data)

            # Check response
            if response.status_code == 200 or response.status_code == 201: # Also check for 201 Created
                print(f"✓ Report saved successfully for user {user_id}")
                return response.json()
            else:
                print(f"✗ Failed to save Report: {response.status_code}")
                print(f"  Response: {response.text}")
                return None

        except requests.exceptions.RequestException as e:
            print(f"✗ Error calling Java API for report: {e}")
            return None
        except KeyError as e:
            print(f"✗ Missing key in report data: {e}")
            return None
        except Exception as e:
            print(f"✗ Unexpected error in save_report: {e}")
            return None

    def save_impfungen(self, user_id: int, data: Dict[str, Any]) -> List[Optional[Dict]]:
        """Saves multiple impfungen records."""
        results: List[Optional[Dict]] = []
        if 'impfungen' not in data or not isinstance(data['impfungen'], list):
            print("✗ 'impfungen' key missing or not a list in data for save_impfungen.")
            return [None] # Or raise an error

        for impfung_item in data['impfungen']:
            if 'Krankheit' not in impfung_item or not isinstance(impfung_item.get('Krankheit'), list):
                print(f"✗ 'Krankheit' key missing or not a list in impfung_item: {impfung_item.get('Impfstoffname', 'N/A')}. Skipping this item's diseases.")
                # Add a None result for each potential disease that would have been processed
                # Or simply skip and don't add to results, depending on desired behavior
                if isinstance(impfung_item.get('Krankheit'), list):
                     results.extend([None] * len(impfung_item.get('Krankheit', [])))
                else: # If 'Krankheit' is not a list at all, we can't determine how many Nones to add
                    results.append(None)
                continue

            for krankheit in impfung_item['Krankheit']:
                item_description = f"Impfung '{impfung_item.get('Impfstoffname', 'N/A')}' for disease '{krankheit}'"
                try:
                    impf_data = {
                        "name": impfung_item['Impfstoffname'],
                        "disease": krankheit,
                        "date": impfung_item['Impfdatum']
                    }

                    url = f"{self.base_url}/api/vaccinations/user/{user_id}"
                    response = self.session.post(url, json=impf_data)

                    if response.status_code == 200 or response.status_code == 201:
                        print(f"✓ {item_description} saved successfully for user {user_id}")
                        results.append(response.json())
                    else:
                        print(f"✗ Failed to save {item_description}: {response.status_code}")
                        print(f"  Response: {response.text}")
                        results.append(None)
                except requests.exceptions.RequestException as e:
                    print(f"✗ Error calling Java API for {item_description}: {e}")
                    results.append(None)
                except KeyError as e:
                    print(f"✗ Missing key in data for {item_description}: {e}")
                    results.append(None)
                except Exception as e:
                    print(f"✗ Unexpected error for {item_description}: {e}")
                    results.append(None)
        return results

    def save_medications(self, user_id: int, data: Dict[str, Any]) -> List[Optional[Dict]]:
        """Saves multiple medication records."""
        results: List[Optional[Dict]] = []
        if 'medikamente' not in data or not isinstance(data['medikamente'], list):
            print("✗ 'medikamente' key missing or not a list in data for save_medications.")
            return [None]

        for medi_item in data["medikamente"]:
            item_description = f"Medication '{medi_item.get('name', 'N/A')}'"
            try:
                medi_data = {
                    "name": medi_item.get("name"),
                    "dailyIntake": medi_item.get("daily_intake") # Ensure Java side can handle potential None or type correctly
                }

                url = f"{self.base_url}/api/meds/user/{user_id}"
                response = self.session.post(url, json=medi_data)

                if response.status_code == 200 or response.status_code == 201:
                    print(f"✓ {item_description} saved successfully for user {user_id}")
                    results.append(response.json())
                else:
                    # Corrected typo from "blood test" to "Medication"
                    print(f"✗ Failed to save {item_description}: {response.status_code}")
                    print(f"  Response: {response.text}")
                    results.append(None)

            except requests.exceptions.RequestException as e:
                print(f"✗ Error calling Java API for {item_description}: {e}")
                results.append(None)
            except KeyError as e: # Though .get() should prevent this for 'name' and 'daily_intake'
                print(f"✗ Missing key in data for {item_description}: {e}")
                results.append(None)
            except Exception as e:
                print(f"✗ Unexpected error for {item_description}: {e}")
                results.append(None)
        return results

    def save_bloodtests(self, user_id: int, data: Dict[str, Any]) -> List[Optional[Dict]]:
        """
        Save blood test data (multiple parameters) to Java backend.
        Args:
            user_id: User ID for the blood test
            data: dict in this format:
            {
                "status": "str",
                "date": "str",
                "parameters": [
                    {"name": "str", "value": float/int}, ...
                ]
            }
        Returns:
            List of response data from Java backend or None for each parameter if failed
        """
        results: List[Optional[Dict]] = []
        if 'parameters' not in data or not isinstance(data['parameters'], list):
            print("✗ 'parameters' key missing or not a list in data for save_bloodtests.")
            return [None]

        test_date = data.get("date", datetime.now().strftime('%Y-%m-%d'))

        for metric in data["parameters"]:
            item_description = f"Blood test metric '{metric.get('name', 'N/A')}'"
            try:
                blood_test_data = {
                    "date": test_date, # Use the common date for all parameters
                    "metric": metric["name"], # Assumes "name" key exists
                    "value": metric["value"]  # Assumes "value" key exists
                }

                url = f"{self.base_url}/api/blood/user/{user_id}"
                response = self.session.post(url, json=blood_test_data)

                if response.status_code == 200 or response.status_code == 201:
                    print(f"✓ {item_description} saved successfully for user {user_id}")
                    results.append(response.json())
                else:
                    print(f"✗ Failed to save {item_description}: {response.status_code}")
                    print(f"  Response: {response.text}")
                    results.append(None)

            except requests.exceptions.RequestException as e:
                print(f"✗ Error calling Java API for {item_description}: {e}")
                results.append(None)
            except KeyError as e:
                print(f"✗ Missing 'name' or 'value' key in parameter data for {item_description}: {e}")
                results.append(None)
            except Exception as e:
                print(f"✗ Unexpected error for {item_description}: {e}")
                results.append(None)
        return results


# Example for testing
if __name__ == "__main__":
    client = JavaAPIClient()
    test_user_id = 1 # Ensure this user ID exists in your backend

    print("--- Testing save_report ---")
    report_data_payload = {
        "date": "2024-01-15",
        "summary": "Test Report Summary",
        "full_text": "This is the full text of the test report."
    }
    report_result = client.save_report(test_user_id, report_data_payload)
    if report_result:
        print("Report test saved successfully!")
        print(json.dumps(report_result, indent=2))
    else:
        print("Failed to save report test.")
    print("-" * 30)


    print("\n--- Testing save_impfungen ---")
    # Corrected test_data for impfungen: 'Krankheit' should be a list
    impfungen_test_data = {
        "impfungen": [
            {
                "Impfstoffname": "AstrazeneCa", # Corrected typo for consistency if needed
                "Krankheit": ["COVID-19 Variant A"], # 'Krankheit' is a list of diseases
                "Impfdatum": "2023-07-24"
            },
            {
                "Impfstoffname": "FluShotXYZ",
                "Krankheit": ["Influenza Type A", "Influenza Type B"],
                "Impfdatum": "2023-10-10"
            },
            { # Example of an item that might have a data issue (e.g., missing Impfstoffname)
                "Krankheit": ["Common Cold Preventative"], # This will cause a KeyError if not handled
                "Impfdatum": "2023-11-01"
            }
        ]
    }
    impfungen_results = client.save_impfungen(test_user_id, impfungen_test_data)
    print(f"Impfungen save results (count: {len(impfungen_results)}):")
    for idx, res in enumerate(impfungen_results):
        if res:
            print(f"  Result {idx+1}: Success")
            # print(json.dumps(res, indent=2)) # Uncomment for full JSON
        else:
            print(f"  Result {idx+1}: Failed or skipped")
    print("-" * 30)


    print("\n--- Testing save_medications ---")
    medications_test_data = {
        "medikamente": [
            {"name": "Lisinopril", "daily_intake": 10},
            {"name": "Metformin", "daily_intake": 500},
            {"name": "Vitamin D", "daily_intake": 2000}
        ]
    }
    medication_results = client.save_medications(test_user_id, medications_test_data)
    print(f"Medications save results (count: {len(medication_results)}):")
    for idx, res in enumerate(medication_results):
        if res:
            print(f"  Result {idx+1}: Success")
        else:
            print(f"  Result {idx+1}: Failed")
    print("-" * 30)


    print("\n--- Testing save_bloodtests ---")
    bloodtests_data_payload = {
        "status": "Pending Review",
        "date": "2024-01-10",
        "parameters": [
            {"name": "HbA1c", "value": 5.8},
            {"name": "Cholesterol Total", "value": 195.0},
            {"name": "LDL", "value": 110.5}
        ]
    }
    bloodtest_results = client.save_bloodtests(test_user_id, bloodtests_data_payload)
    print(f"Blood tests save results (count: {len(bloodtest_results)}):")
    for idx, res in enumerate(bloodtest_results):
        if res:
            print(f"  Result {idx+1}: Success")
        else:
            print(f"  Result {idx+1}: Failed")
    print("-" * 30)