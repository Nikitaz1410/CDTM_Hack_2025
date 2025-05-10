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

class Impfung(BaseModel):
    Impfstoffname: str
    Krankheit: list[str]
    Impfdatum: str

class Impfpass(BaseModel):
    status: str
    impfungen: list[Impfung]

### -------------- ###

### -- Befunde -- ###

class Paragraph(BaseModel):
    caption: str
    full_text: str

class Befund(BaseModel):
    status: str
    date: str
    summary: str
    paragraphs: list[Paragraph]

### -- Medikation -- ###

class Medikament(BaseModel):
    name: str
    daily_intake: int

class Medikation(BaseModel):
    status: str
    date: str
    medikamente: list[Medikament]