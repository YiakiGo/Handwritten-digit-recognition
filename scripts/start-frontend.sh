#!/bin/bash

# Digit Recognition Frontend Startup Script
set -e

echo "========================================"
echo "   Digit Recognition Frontend"
echo "========================================"
echo

# Change to frontend directory
cd "$(dirname "$0")/../frontend"

# Check Node.js installation
echo "Checking Node.js installation..."
if ! command -v node &> /dev/null; then
    echo "ERROR: Node.js is not installed or not in PATH"
    echo "Please install Node.js 16 or higher"
    exit 1
fi

echo
echo "Node.js version:"
node --version

echo
echo "npm version:"
npm --version

echo
echo "Installing/updating dependencies..."
npm install

if [ $? -ne 0 ]; then
    echo "ERROR: Failed to install dependencies"
    exit 1
fi

echo
echo "Starting Vue.js development server..."
echo "Frontend will be available at: http://localhost:8080"
echo
echo "Press Ctrl+C to stop the server"
echo

# Start the development server
npm run dev

if [ $? -ne 0 ]; then
    echo
    echo "ERROR: Frontend server failed to start"
    echo "Check the logs above for details"
    exit 1
fi