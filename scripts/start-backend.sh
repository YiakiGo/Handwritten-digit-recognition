#!/bin/bash

# Digit Recognition Backend Startup Script
set -e

echo "========================================"
echo "   Digit Recognition Backend Server"
echo "========================================"
echo

# Change to backend directory
cd "$(dirname "$0")/../backend"

# Check Java installation
echo "Checking Java installation..."
if ! command -v java &> /dev/null; then
    echo "ERROR: Java is not installed or not in PATH"
    echo "Please install Java 11 or higher"
    exit 1
fi

# Check Maven installation
echo "Checking Maven installation..."
if ! command -v mvn &> /dev/null; then
    echo "ERROR: Maven is not installed or not in PATH"
    echo "Please install Maven 3.6 or higher"
    exit 1
fi

echo
echo "Java version:"
java -version

echo
echo "Maven version:"
mvn --version

echo
echo "Cleaning and building project..."
mvn clean compile

if [ $? -ne 0 ]; then
    echo "ERROR: Build failed!"
    exit 1
fi

echo
echo "Starting Spring Boot application..."
echo "Backend will be available at: http://localhost:8081"
echo "API Documentation: http://localhost:8081/api"
echo "H2 Database Console: http://localhost:8081/api/h2-console"
echo
echo "Press Ctrl+C to stop the server"
echo

# Start the Spring Boot application
mvn spring-boot:run

if [ $? -ne 0 ]; then
    echo
    echo "ERROR: Application failed to start"
    echo "Check the logs above for details"
    exit 1
fi