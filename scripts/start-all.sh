#!/bin/bash

# Digit Recognition - All Services Startup Script
set -e

echo "========================================"
echo "   Starting All Digit Recognition Services"
echo "========================================"
echo

echo "This will start:"
echo "- Backend Server (Spring Boot) on port 8081"
echo "- ML Service (Python Flask) on port 5000"
echo "- Frontend (Vue.js) on port 8080"
echo

read -p "Start all services? (Y/N): " -n 1 -r
echo
if [[ ! $REPLY =~ ^[Yy]$ ]]; then
    echo "Operation cancelled."
    exit 0
fi

echo
echo "Starting services in background..."
echo

# Function to start service in background and save PID
start_service() {
    local service_name="$1"
    local script_name="$2"
    local log_file="$(dirname "$0")/../logs/${service_name}.log"
    
    # Create logs directory if it doesn't exist
    mkdir -p "$(dirname "$0")/../logs"
    
    echo "Starting $service_name..."
    bash "$(dirname "$0")/$script_name" > "$log_file" 2>&1 &
    local pid=$!
    echo $pid > "$(dirname "$0")/../logs/${service_name}.pid"
    echo "$service_name started with PID: $pid"
}

# Start services
start_service "backend" "start-backend.sh"
sleep 5

start_service "ml-service" "start-ml-service.sh"
sleep 5

start_service "frontend" "start-frontend.sh"

echo
echo "All services started!"
echo
echo "Access points:"
echo "- Frontend: http://localhost:8080"
echo "- Backend API: http://localhost:8081/api"
echo "- ML Service: http://localhost:5000"
echo "- H2 Console: http://localhost:8081/api/h2-console"
echo
echo "Log files are in the logs/ directory"
echo "PID files are in the logs/ directory"
echo
echo "To stop all services, run: ./stop-all.sh"
echo