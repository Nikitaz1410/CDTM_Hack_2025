from server.image_engine.schematas import *
from server.image_engine.system_prompts import *

def mapping(cl):
    return {
        "blutbild": (Blutbild, blutbild_prompt, cl.save_bloodtest),
        "impfpass": (Impfpass, impfpass_prompt, cl.save_impfung),
        "befund": (Befund, befund_prompt),
        "medikation": (Medikation, medikation_prompt, cl.save_medication),
        "other": (Befund, other_prompt)
    }