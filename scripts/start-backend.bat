@echo off
title Digit Recognition Backend Server
echo ========================================
echo    Digit Recognition Backend Server
echo ========================================
echo.

:: Change to backend directory
cd /d %~dp0..\backend

echo Checking Java installation...
java -version >nul 2>&1
if %errorlevel% neq 0 (
    echo ERROR: Java is not installed or not in PATH
    echo Please install Java 11 or higher
    pause
    exit /b 1
)

echo Checking Maven installation...
mvn -version >nul 2>&1
if %errorlevel% neq 0 (
    echo ERROR: Maven is not installed or not in PATH
    echo Please install Maven 3.6 or higher
    pause
    exit /b 1
)

echo.
echo Cleaning and building project...
call mvn clean compile

if %errorlevel% neq 0 (
    echo ERROR: Build failed!
    pause
    exit /b 1
)

echo.
echo Starting Spring Boot application...
echo Backend will be available at: http://localhost:8081
echo API Documentation: http://localhost:8081/api
echo H2 Database Console: http://localhost:8081/api/h2-console
echo.
echo Press Ctrl+C to stop the server
echo.

:: Start the Spring Boot application
call mvn spring-boot:run

if %errorlevel% neq 0 (
    echo.
    echo ERROR: Application failed to start
    echo Check the logs above for details
    pause
    exit /b 1
)

pause