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

### -- Impfpass -- ###

class Impfung:
    Impfstoffname: str
    Krankheit: str
    Impfdatum: str
    Dosisnummer: str
    Impfstoffhersteller: str

class Impfpass:
    impfungen: list[Impfung]