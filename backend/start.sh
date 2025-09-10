#!/bin/bash

# Install Python dependencies
echo "Installing Python dependencies..."
pip install -r requirements.txt

# Start the FastAPI server
echo "Starting Timetable Generator API..."
uvicorn main:app --host 0.0.0.0 --port 8000 --reload
