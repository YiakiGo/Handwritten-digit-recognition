@echo off
title Digit Recognition - Install Dependencies
echo ========================================
echo    Digit Recognition Dependency Installer
echo ========================================
echo.
echo This script will check and install required dependencies.
echo.

echo Checking Java...
java -version >nul 2>&1
if %errorlevel% equ 0 (
    echo [✓] Java is installed
    java -version
) else (
    echo [✗] Java is NOT installed
    echo Please install Java 11 or higher from:
    echo https://adoptium.net/
    echo.
)

echo.
echo Checking Maven...
mvn -version >nul 2>&1
if %errorlevel% equ 0 (
    echo [✓] Maven is installed
    mvn -version
) else (
    echo [✗] Maven is NOT installed
    echo Please install Maven 3.6 or higher from:
    echo https://maven.apache.org/
    echo.
)

echo.
echo Checking Node.js...
node --version >nul 2>&1
if %errorlevel% equ 0 (
    echo [✓] Node.js is installed
    node --version
    npm --version
) else (
    echo [✗] Node.js is NOT installed
    echo Please install Node.js 16 or higher from:
    echo https://nodejs.org/
    echo.
)

echo.
echo Checking Python...
python --version >nul 2>&1
if %errorlevel% equ 0 (
    echo [✓] Python is installed
    python --version
) else (
    echo [✗] Python is NOT installed
    echo Please install Python 3.8 or higher from:
    echo https://python.org/
    echo.
)

echo.
echo Checking Git...
git --version >nul 2>&1
if %errorlevel% equ 0 (
    echo [✓] Git is installed
    git --version
) else (
    echo [✗] Git is NOT installed
    echo Please install Git from:
    echo https://git-scm.com/
    echo.
)

echo.
echo ========================================
echo Dependency check completed!
echo.
echo If any dependencies are missing, please install them
echo and run this script again.
echo.

pause
