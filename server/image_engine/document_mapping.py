from server.image_engine.schematas import *
from server.image_engine.system_prompts import *

mapping = {
    "blutbild": (Blutbild, blutbild_prompt),
    "impfpass": (Impfpass, impfpass_prompt),
    "befund": (Befund, befund_prompt),
    "medikation": (Medikation, medikation_prompt),
    "other": (Befund, other_prompt)
}