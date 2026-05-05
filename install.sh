#!/bin/bash

# MatchMe Installation & Setup Script (Linux/macOS)
# This script prepares the environment, starts the database, and launches the application.

# Colors for output
GREEN='\033[0;32m'
BLUE='\033[0;34m'
YELLOW='\033[1;33m'
RED='\033[0;31m'
NC='\033[0m' # No Color

echo -e "${BLUE}==================================================${NC}"
echo -e "${BLUE}      MatchMe Social Platform - Setup Wizard      ${NC}"
echo -e "${BLUE}==================================================${NC}"

# 1. Check Dependencies
echo -e "\n${YELLOW}[1/5] Checking Dependencies...${NC}"

check_cmd() {
    if ! command -v $1 &> /dev/null; then
        echo -e "${RED}Error: $1 is not installed.${NC}"
        return 1
    fi
    return 0
}

check_cmd "docker" || exit 1
check_cmd "java" || exit 1
check_cmd "npm" || exit 1

# 2. Setup Environment
echo -e "\n${YELLOW}[2/5] Setting up Environment...${NC}"
if [ ! -f "backend/.env" ]; then
    echo -e "${BLUE}Creating default backend/.env file...${NC}"
    cp backend/.env.example backend/.env 2>/dev/null || cat > backend/.env <<EOF
DB_URL=jdbc:postgresql://127.0.0.1:5433/matchme
DB_USERNAME=postgres
DB_PASSWORD=postgres
CLOUDINARY_CLOUD_NAME=your_cloud_name
CLOUDINARY_API_KEY=your_api_key
CLOUDINARY_API_SECRET=your_api_secret
JWT_SECRET=super_secret_jwt_key_that_is_long_enough_for_hs256
JWT_EXPIRATION=86400000
FRONTEND_URL=http://localhost:5173
EOF
    echo -e "${GREEN}Environment file created.${NC}"
else
    echo -e "${GREEN}Backend .env already exists.${NC}"
fi

# 3. Start Database
echo -e "\n${YELLOW}[3/5] Starting PostgreSQL (Docker)...${NC}"
docker compose up -d
echo -e "${GREEN}Database is running on port 5433.${NC}"

# 4. Build and Start Backend
echo -e "\n${YELLOW}[4/5] Building and Starting Backend...${NC}"
cd backend
./mvnw clean package -DskipTests
if [ $? -ne 0 ]; then
    echo -e "${RED}Backend build failed.${NC}"
    exit 1
fi

echo -e "${BLUE}Launching Backend in background...${NC}"
export $(grep -v '^#' .env | xargs)
nohup java -jar target/backend-0.0.1-SNAPSHOT.jar > backend.log 2>&1 &
BACKEND_PID=$!
echo -e "${GREEN}Backend started (PID: $BACKEND_PID). Logs: backend/backend.log${NC}"
cd ..

# 5. Start Frontend
echo -e "\n${YELLOW}[5/5] Installing and Starting Frontend...${NC}"
cd frontend
npm install
echo -e "${GREEN}Frontend dependencies installed.${NC}"

echo -e "${BLUE}--------------------------------------------------${NC}"
echo -e "${GREEN}Setup Complete!${NC}"
echo -e "Backend: http://localhost:8085"
echo -e "Frontend: http://localhost:5173"
echo -e "${BLUE}--------------------------------------------------${NC}"
echo -e "To view the app, run 'npm run dev' in the frontend directory."
echo -e "The dev server is starting now..."

npm run dev
