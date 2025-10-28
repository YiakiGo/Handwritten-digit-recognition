@echo off
title Digit Recognition ML Service
echo ========================================
echo    Digit Recognition ML Service
echo ========================================
echo.

:: Change to ml-service directory
cd /d %~dp0..\ml-service

echo Checking Python installation...
python --version >nul 2>&1
if %errorlevel% neq 0 (
    echo ERROR: Python is not installed or not in PATH
    echo Please install Python 3.8 or higher
    pause
    exit /b 1
)

echo.
echo Installing/updating Python dependencies...
python -m pip install --upgrade pip
python -m pip install -r requirements.txt

if %errorlevel% neq 0 (
    echo ERROR: Failed to install dependencies
    pause
    exit /b 1
)

echo.
echo Starting Flask ML Service...
echo ML Service will be available at: http://localhost:5000
echo.
echo Press Ctrl+C to stop the service
echo.

:: Start the Flask application
python app.py

if %errorlevel% neq 0 (
    echo.
    echo ERROR: ML Service failed to start
    echo Check the logs above for details
    pause
    exit /b 1
)

pause