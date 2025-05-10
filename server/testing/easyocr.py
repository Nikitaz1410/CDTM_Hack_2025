import easyocr

IMAGE_PATH = "/data/PXL_20250509_215016645.jpg"

reader = easyocr.Reader(['de'])
result = reader.readtext(IMAGE_PATH)
for detection in result:
    print(detection)