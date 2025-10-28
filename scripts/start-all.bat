@echo off
title Digit Recognition - All Services
echo ========================================
echo    Starting All Digit Recognition Services
echo ========================================
echo.

echo This will start:
echo - Backend Server (Spring Boot) on port 8081
echo - ML Service (Python Flask) on port 5000
echo - Frontend (Vue.js) on port 8080
echo.

set /p startAll="Start all services? (Y/N): "
if /i "%startAll%" neq "Y" (
    echo Operation cancelled.
    pause
    exit /b 0
)

echo.
echo Starting services...
echo.

:: Start Backend in a new window
start "Digit Recognition Backend" cmd /k "%~dp0start-backend.bat"

:: Wait a bit for backend to start
timeout /t 5 /nobreak >nul

:: Start ML Service in a new window
start "Digit Recognition ML Service" cmd /k "%~dp0start-ml-service.bat"

:: Wait a bit for ML service to start
timeout /t 5 /nobreak >nul

:: Start Frontend in a new window
start "Digit Recognition Frontend" cmd /k "%~dp0start-frontend.bat"

echo.
echo All services started!
echo.
echo Access points:
echo - Frontend: http://localhost:8080
echo - Backend API: http://localhost:8081/api
echo - ML Service: http://localhost:5000
echo - H2 Console: http://localhost:8081/api/h2-console
echo.
echo Each service is running in a separate window.
echo Close the windows to stop the services.
echo.

pause