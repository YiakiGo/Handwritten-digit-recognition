@echo off
title Digit Recognition Frontend
echo ========================================
echo    Digit Recognition Frontend
echo ========================================
echo.

:: Change to frontend directory
cd /d %~dp0..\frontend

echo Checking Node.js installation...
node --version >nul 2>&1
if %errorlevel% neq 0 (
    echo ERROR: Node.js is not installed or not in PATH
    echo Please install Node.js 16 or higher
    pause
    exit /b 1
)

echo.
echo Installing/updating dependencies...
call npm install

if %errorlevel% neq 0 (
    echo ERROR: Failed to install dependencies
    pause
    exit /b 1
)

echo.
echo Starting Vue.js development server...
echo Frontend will be available at: http://localhost:8080
echo.
echo Press Ctrl+C to stop the server
echo.

:: Start the development server
call npm run dev

if %errorlevel% neq 0 (
    echo.
    echo ERROR: Frontend server failed to start
    echo Check the logs above for details
    pause
    exit /b 1
)

pause