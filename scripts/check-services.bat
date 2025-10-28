@echo off
title Service Status Check
echo ========================================
echo    Digit Recognition Services Status
echo ========================================
echo.

echo Checking services...
echo.

:: Check Backend
echo Backend Service (port 8081):
curl -s -o nul -w "%%{http_code}" http://localhost:8081/api/actuator/health
if %errorlevel% equ 0 (
    curl -s http://localhost:8081/api/actuator/health | findstr "status" >nul
    if %errorlevel% equ 0 (
        echo [RUNNING]
    ) else (
        echo [UNKNOWN]
    )
) else (
    echo [STOPPED]
)

:: Check ML Service
echo ML Service (port 5000):
curl -s -o nul -w "%%{http_code}" http://localhost:5000/status
if %errorlevel% equ 0 (
    echo [RUNNING]
) else (
    echo [STOPPED]
)

:: Check Frontend
echo Frontend (port 8080):
curl -s -o nul -w "%%{http_code}" http://localhost:8080
if %errorlevel% equ 0 (
    echo [RUNNING]
) else (
    echo [STOPPED]
)

echo.
echo Service URLs:
echo - Frontend: http://localhost:8080
echo - Backend API: http://localhost:8081/api
echo - ML Service: http://localhost:5000
echo.

pause