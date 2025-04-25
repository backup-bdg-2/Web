#!/bin/bash

# Start the server
cd /workspace/Web/server
npm start &
SERVER_PID=$!

# Start the client
cd /workspace/Web/client
npm run dev &
CLIENT_PID=$!

# Function to handle script termination
function cleanup {
  echo "Stopping server and client..."
  kill $SERVER_PID
  kill $CLIENT_PID
  exit
}

# Trap SIGINT and SIGTERM signals
trap cleanup SIGINT SIGTERM

# Keep the script running
echo "Server running on port 12001"
echo "Client running on port 12000"
echo "Press Ctrl+C to stop both services"
wait