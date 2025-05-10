// src/data/sampleData.js

export const sampleHealthData = {
    bloodTests: [
        {
            status: "normal",
            date: "2025-05-09",
            parameters: [
                { name: "Hämoglobin", value: 15.2 },
                { name: "Erythrozyten", value: 4.8 },
                { name: "Leukozyten", value: 6.2 },
                { name: "Thrombozyten", value: 250 },
                { name: "Blutzucker", value: 95 },
                { name: "Cholesterin", value: 180 },
                { name: "Triglyceride", value: 120 },
                { name: "Harnsäure", value: 5.5 }
            ]
        },
        {
            status: "warning",
            date: "2025-04-15",
            parameters: [
                { name: "Hämoglobin", value: 14.8 },
                { name: "Erythrozyten", value: 4.5 },
                { name: "Leukozyten", value: 8.5 },
                { name: "Thrombozyten", value: 280 },
                { name: "Blutzucker", value: 115 },
                { name: "Cholesterin", value: 220 },
                { name: "Triglyceride", value: 180 },
                { name: "Harnsäure", value: 7.2 }
            ]
        },
        {
            status: "normal",
            date: "2025-01-20",
            parameters: [
                { name: "Hämoglobin", value: 15.5 },
                { name: "Erythrozyten", value: 4.9 },
                { name: "Leukozyten", value: 5.8 },
                { name: "Thrombozyten", value: 230 },
                { name: "Blutzucker", value: 88 },
                { name: "Cholesterin", value: 165 },
                { name: "Triglyceride", value: 95 },
                { name: "Harnsäure", value: 4.8 }
            ]
        }
    ],

    vaccinations: [
        {
            status: "complete",
            impfungen: [
                {
                    Impfstoffname: "Tetanus/Diphtherie/Pertussis",
                    Krankheit: ["Tetanus", "Diphtherie", "Keuchhusten"],
                    Impfdatum: "2024-03-15"
                },
                {
                    Impfstoffname: "Hepatitis B",
                    Krankheit: ["Hepatitis B"],
                    Impfdatum: "2023-11-22"
                },
                {
                    Impfstoffname: "Grippe (Influenza)",
                    Krankheit: ["Influenza"],
                    Impfdatum: "2024-10-01"
                },
                {
                    Impfstoffname: "COVID-19 Booster",
                    Krankheit: ["COVID-19"],
                    Impfdatum: "2024-09-10"
                },
                {
                    Impfstoffname: "Masern/Mumps/Röteln",
                    Krankheit: ["Masern", "Mumps", "Röteln"],
                    Impfdatum: "2022-05-18"
                }
            ]
        }
    ],

    medicalReports: [
        {
            status: "normal",
            date: "2025-05-08",
            summary: "Routineuntersuchung: Alle Vitalfunktionen normal. Keine Auffälligkeiten.",
            paragraphs: [
                {
                    caption: "Anamnese",
                    full_text: "Patient klagt über gelegentliche Kopfschmerzen, keine weiteren Beschwerden. Vorgeschichte: Arterielle Hypertonie, gut eingestellt."
                },
                {
                    caption: "Körperliche Untersuchung",
                    full_text: "Allgemeinzustand: gut, wach, orientiert. Kreislauf: RR 125/80 mmHg, Puls 72/min, regelmäßig. Herz: Herzaktion rein, rhythmisch. Lunge: vesikuläres Atemgeräusch, keine pathologischen Nebengeräusche."
                },
                {
                    caption: "Diagnose",
                    full_text: "1. Z.n. arterieller Hypertonie, gut eingestellt\n2. Gelegentliche Cephalgie"
                },
                {
                    caption: "Therapie",
                    full_text: "Bestehende Medikation fortführen. Bei persistierenden Kopfschmerzen Wiedervorstellung."
                }
            ]
        },
        {
            status: "warning",
            date: "2025-03-22",
            summary: "Nachuntersuchung: Leicht erhöhte Leberwerte. Kontrolluntersuchung empfohlen.",
            paragraphs: [
                {
                    caption: "Laborbefund",
                    full_text: "GOT: 45 U/l (Norm: <35), GPT: 52 U/l (Norm: <45), GGT: 68 U/l (Norm: <55)"
                },
                {
                    caption: "Beurteilung",
                    full_text: "Leicht erhöhte Lebertransaminasen, möglicherweise medikamentös bedingt oder durch Alkoholkonsum."
                },
                {
                    caption: "Empfehlung",
                    full_text: "Kontrolle der Leberwerte in 4 Wochen. Einschränkung des Alkoholkonsums empfohlen."
                }
            ]
        }
    ],

    medications: [
        {
            status: "current",
            date: "2025-05-01",
            medikamente: {
                "Ramipril 5mg": {
                    morning: 1,
                    noon: 0,
                    night: 0,
                    comment: "Gegen Bluthochdruck, morgens nüchtern einnehmen"
                },
                "Metformin 500mg": {
                    morning: 1,
                    noon: 0,
                    night: 1,
                    comment: "Mit den Mahlzeiten einnehmen"
                },
                "Vitamin D3 1000 IE": {
                    morning: 0,
                    noon: 0,
                    night: 1,
                    comment: "Einmal täglich abends"
                },
                "Omega-3": {
                    morning: 1,
                    noon: 0,
                    night: 1,
                    comment: "Zu den Mahlzeiten"
                }
            }
        },
        {
            status: "previous",
            date: "2024-11-15",
            medikamente: {
                "Ramipril 2.5mg": {
                    morning: 1,
                    noon: 0,
                    night: 0,
                    comment: "Niedrigere Dosierung"
                },
                "Metformin 500mg": {
                    morning: 1,
                    noon: 0,
                    night: 1,
                    comment: "Mit den Mahlzeiten einnehmen"
                }
            }
        }
    ]
};

export const sampleDocuments = [
    {
        id: 1,
        filename: "blutbild_2025_05_09.pdf",
        name: "Blutbild",
        date: "2025-05-09",
        size: 256789,
        uploaded_at: "2025-05-09T10:30:00.000Z",
        url: "/api/document/blutbild_2025_05_09.pdf",
        type: "bloodTest"
    },
    {
        id: 2,
        filename: "impfpass_aktuell.pdf",
        name: "Impfpass",
        date: "2024-10-01",
        size: 189432,
        uploaded_at: "2024-10-01T14:15:00.000Z",
        url: "/api/document/impfpass_aktuell.pdf",
        type: "vaccination"
    },
    {
        id: 3,
        filename: "befund_2025_05_08.pdf",
        name: "Arztbefund",
        date: "2025-05-08",
        size: 145678,
        uploaded_at: "2025-05-08T16:45:00.000Z",
        url: "/api/document/befund_2025_05_08.pdf",
        type: "medicalReport"
    },
    {
        id: 4,
        filename: "medikationsplan_2025.pdf",
        name: "Medikationsplan",
        date: "2025-05-01",
        size: 98765,
        uploaded_at: "2025-05-01T09:20:00.000Z",
        url: "/api/document/medikationsplan_2025.pdf",
        type: "medication"
    },
    {
        id: 5,
        filename: "blutbild_2025_04_15.pdf",
        name: "Blutbild (Kontroll)",
        date: "2025-04-15",
        size: 234567,
        uploaded_at: "2025-04-15T11:00:00.000Z",
        url: "/api/document/blutbild_2025_04_15.pdf",
        type: "bloodTest"
    }
];