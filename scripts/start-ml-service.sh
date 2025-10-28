#!/bin/bash

# Digit Recognition ML Service Startup Script
set -e

echo "========================================"
echo "   Digit Recognition ML Service"
echo "========================================"
echo

# Change to ml-service directory
cd "$(dirname "$0")/../ml-service"

# Check Python installation
echo "Checking Python installation..."
if ! command -v python3 &> /dev/null; then
    echo "ERROR: Python3 is not installed or not in PATH"
    echo "Please install Python 3.8 or higher"
    exit 1
fi

echo
echo "Python version:"
python3 --version

echo
echo "Installing/updating Python dependencies..."
python3 -m pip install --upgrade pip
python3 -m pip install -r requirements.txt

if [ $? -ne 0 ]; then
    echo "ERROR: Failed to install dependencies"
    exit 1
fi

echo
echo "Starting Flask ML Service..."
echo "ML Service will be available at: http://localhost:5000"
echo
echo "Press Ctrl+C to stop the service"
echo

# Start the Flask application
python3 app.py

if [ $? -ne 0 ]; then
    echo
    echo "ERROR: ML Service failed to start"
    echo "Check the logs above for details"
    exit 1
fi