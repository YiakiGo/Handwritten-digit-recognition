@echo off
title Stop All Digit Recognition Services
echo ========================================
echo    Stopping All Digit Recognition Services
echo ========================================
echo.

echo This will stop:
echo - Backend Server (Spring Boot)
echo - ML Service (Python Flask) 
echo - Frontend (Vue.js)
echo.

set /p stopAll="Stop all services? (Y/N): "
if /i "%stopAll%" neq "Y" (
    echo Operation cancelled.
    pause
    exit /b 0
)

echo.
echo Stopping services...
echo.

:: Stop Frontend (Node.js processes on port 8080)
echo Stopping Frontend...
for /f "tokens=5" %%a in ('netstat -ano ^| findstr :8080 ^| findstr LISTENING') do (
    taskkill /PID %%a /F >nul 2>&1
    echo Killed frontend process PID: %%a
)

:: Stop ML Service (Python processes on port 5000)
echo Stopping ML Service...
for /f "tokens=5" %%a in ('netstat -ano ^| findstr :5000 ^| findstr LISTENING') do (
    taskkill /PID %%a /F >nul 2>&1
    echo Killed ML service process PID: %%a
)

:: Stop Backend (Java processes on port 8081)
echo Stopping Backend...
for /f "tokens=5" %%a in ('netstat -ano ^| findstr :8081 ^| findstr LISTENING') do (
    taskkill /PID %%a /F >nul 2>&1
    echo Killed backend process PID: %%a
)

:: Additional cleanup for any remaining processes
echo Cleaning up remaining processes...

:: Kill Node.js processes
taskkill /F /IM node.exe >nul 2>&1
if %errorlevel% equ 0 echo Killed remaining Node.js processes

:: Kill Python processes (be more specific to avoid killing system Python)
for /f "tokens=2" %%a in ('tasklist ^| findstr /i "python.*app.py"') do (
    taskkill /F /IM %%a >nul 2>&1
    if %errorlevel% equ 0 echo Killed Python process: %%a
)

:: Kill Java processes (specific to our app)
for /f "tokens=2" %%a in ('tasklist ^| findstr /i "java.*digit-recognition"') do (
    taskkill /F /IM %%a >nul 2>&1
    if %errorlevel% equ 0 echo Killed Java process: %%a
)

echo.
echo All services stopped!
echo.

:: Wait a moment and check status
timeout /t 2 /nobreak >nul
call %~dp0check-services.bat