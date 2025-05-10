from schematas import *
from system_prompts import *

mapping = {
    "blutbild": (Blutbild, blutbild_prompt),
    "impfpass": (Impfpass, impfpass_prompt),
    "befund": (Befund, befund_prompt),
    "medikation": (Medikation, medikation_prompt),
    "other": (Befund, other_prompt)
}