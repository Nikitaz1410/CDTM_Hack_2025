#!/bin/bash
set -e

# Starte FastAPI (Uvicorn) im Hintergrund
.server/venv/bin/uvicorn app.main:app --host 0.0.0.0 --port 8000 &
UVICORN_PID=$!

# Starte Spring Boot JAR im Hintergrund
java -jar .//youruser/project/app.jar --server.port=8080 &
SPRING_PID=$!

# Auf beide Prozesse warten (wenn einer abstürzt, beendet sich das Script)
wait $UVICORN_PID
wait $SPRING_PID