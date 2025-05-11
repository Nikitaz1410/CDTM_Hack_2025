from server.image_engine.schematas import *
from server.image_engine.system_prompts import *

def mapping(cl):
    return {
        "blutbild": (Blutbild, blutbild_prompt, cl.save_bloodtests),
        "impfpass": (Impfpass, impfpass_prompt, cl.save_impfungen),
        "befund": (Befund, befund_prompt, cl.save_report),
        "medikation": (Medikation, medikation_prompt, cl.save_medications),
    }