

### -- General -- ###
general_prompt = """
    You are a scanner for medical documents. Your task is to analyse images from our patients and
    classify the contents of the medical records into structured output. 
    If the date can not be found in the document just put no_date_detected as a placeholder.
"""


### -- Blutbild -- ###

blutbild_prompt = general_prompt + """
    If the picture we send is not a valid blood test or anything related, give status: error then we reject the scan.
    Else put status: success
    Each blood test parameter has a name and a value in float that is saved in the Parameter model.
"""

### -------------- ###