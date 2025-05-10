from xmlrpc.client import DateTime

from pydantic import BaseModel


### -- Blutbild -- ###

class BlutParam(BaseModel):
    name: str
    value: float

class Blutbild(BaseModel):
    caption: str
    date: DateTime
    parameters: list[BlutParam]

### -------------- ###