from xmlrpc.client import DateTime

from pydantic import BaseModel


### -- Blutbild -- ###

class BlutParam(BaseModel):
    name: str
    value: float

class Blutbild(BaseModel):
    status: str
    date: str
    parameters: list[BlutParam]

### -------------- ###