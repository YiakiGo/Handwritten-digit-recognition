#!/bin/bash

# Digit Recognition - Stop All Services Script

echo "========================================"
echo "   Stopping All Digit Recognition Services"
echo "========================================"
echo

# Function to stop service by PID file
stop_service() {
    local service_name="$1"
    local pid_file="$(dirname "$0")/../logs/${service_name}.pid"
    
    if [ -f "$pid_file" ]; then
        local pid=$(cat "$pid_file")
        if kill -0 "$pid" 2>/dev/null; then
            echo "Stopping $service_name (PID: $pid)..."
            kill "$pid"
            rm "$pid_file"
            echo "$service_name stopped."
        else
            echo "$service_name was not running."
            rm "$pid_file"
        fi
    else
        echo "No PID file found for $service_name."
    fi
}

# Stop services
stop_service "frontend"
stop_service "ml-service"
stop_service "backend"

echo
echo "All services stopped!"
echo

# Clean up any remaining processes (optional)
pkill -f "node.*vite" 2>/dev/null || true
pkill -f "python.*app.py" 2>/dev/null || true
pkill -f "java.*digit-recognition" 2>/dev/null || true

echo "Cleanup completed."