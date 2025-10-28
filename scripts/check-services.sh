#!/bin/bash

# Digit Recognition Services Status Check

echo "========================================"
echo "   Digit Recognition Services Status"
echo "========================================"
echo

echo "Checking services..."
echo

# Function to check service status
check_service() {
    local service_name="$1"
    local url="$2"
    
    echo -n "$service_name: "
    if curl -s --connect-timeout 3 "$url" > /dev/null; then
        echo "[RUNNING]"
    else
        echo "[STOPPED]"
    fi
}

# Check services
check_service "Backend Service (port 8081)" "http://localhost:8081/api/actuator/health"
check_service "ML Service (port 5000)" "http://localhost:5000/status"
check_service "Frontend (port 8080)" "http://localhost:8080"

echo
echo "Service URLs:"
echo "- Frontend: http://localhost:8080"
echo "- Backend API: http://localhost:8081/api"
echo "- ML Service: http://localhost:5000"
echo