@echo off
title Digit Recognition Quick Start
echo ========================================
echo    Digit Recognition Quick Start
echo ========================================
echo.
echo This script will:
echo 1. Check dependencies
echo 2. Install required packages
echo 3. Start all services
echo.

set /p proceed="Proceed? (Y/N): "
if /i "%proceed%" neq "Y" (
    echo Operation cancelled.
    pause
    exit /b 0
)

echo.
echo Step 1: Checking dependencies...
call %~dp0install-dependencies.bat

echo.
echo Step 2: Installing backend dependencies...
cd /d %~dp0..\backend
call mvn clean compile
if %errorlevel% neq 0 (
    echo ERROR: Backend build failed!
    pause
    exit /b 1
)

echo.
echo Step 3: Installing frontend dependencies...
cd /d %~dp0..\frontend
call npm install
if %errorlevel% neq 0 (
    echo ERROR: Frontend dependencies installation failed!
    pause
    exit /b 1
)

echo.
echo Step 4: Installing ML service dependencies...
cd /d %~dp0..\ml-service
call python -m pip install -r requirements.txt
if %errorlevel% neq 0 (
    echo ERROR: ML service dependencies installation failed!
    pause
    exit /b 1
)

echo.
echo Step 5: Starting all services...
cd /d %~dp0
start "Digit Recognition Backend" cmd /k "start-backend.bat"
timeout /t 8 /nobreak >nul

start "Digit Recognition ML Service" cmd /k "start-ml-service.bat"
timeout /t 8 /nobreak >nul

start "Digit Recognition Frontend" cmd /k "start-frontend.bat"

echo.
echo ========================================
echo All services started successfully!
echo.
echo Access points:
echo - Frontend: http://localhost:8080
echo - Backend API: http://localhost:8081/api
echo - ML Service: http://localhost:5000
echo.
echo Each service is running in a separate window.
echo Use 'stop-all.bat' to stop all services.
echo.

timeout /t 3 /nobreak >nul
start "" "http://localhost:8080"

pause