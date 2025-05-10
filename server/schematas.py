from pydantic import BaseModel


### -- Blutbild -- ###

class BlutParam(BaseModel):
    name: str
    value: float

class Blutbild(BaseModel):
    caption: str
    parameters: list[BlutParam]

### -------------- ###