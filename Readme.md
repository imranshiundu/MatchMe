# Backend Setup

This is a Spring Boot backend application using environment variables for configuration. Sensitive data is not stored in
the repository.

## Prerequisites

- Java 17+
- Maven
- PostgreSQL
- Docker (required for PostgreSQL database)

## Environment setup

### 1. Create `.env` file

Inside the `backend/` directory, create a file named `.env`.

You can copy the template:

```
cp .env.example .env
```

## .env.example

This file contains all required environment variables with placeholder values.

It is safe to commit to Git and acts as a setup template.

```
DB_URL=jdbc:postgresql://127.0.0.1:5433/matchme  
DB_USERNAME=your_db_username  
DB_PASSWORD=your_db_password

CLOUDINARY_CLOUD_NAME=your_cloud_name  
CLOUDINARY_API_KEY=your_api_key  
CLOUDINARY_API_SECRET=your_api_secret

JWT_SECRET=your_jwt_secret  
JWT_EXPIRATION=1800000

FRONTEND_URL=http://localhost:5173
``` 

As we are using shared cloudinary cloud for profile
picture in this school project, cloudinary keys are included.

```
CLOUDINARY_CLOUD_NAME=ddvukican
CLOUDINARY_API_KEY=864197745289786
CLOUDINARY_API_SECRET=dJyHD8io_OofCYLXLQI8hAtkTRk
```

## How it works

At startup, the .env file is loaded and injected into system properties.
Spring Boot then resolves them via application.properties.

Example mapping:

```
spring.datasource.url=${DB_URL}  
spring.datasource.username=${DB_USERNAME}  
spring.datasource.password=${DB_PASSWORD}

cloudinary.cloud-name=${CLOUDINARY_CLOUD_NAME}  
cloudinary.api-key=${CLOUDINARY_API_KEY}  
cloudinary.api-secret=${CLOUDINARY_API_SECRET}

jwt.secret=${JWT_SECRET}  
jwt.expiration=${JWT_EXPIRATION}

app.frontend.url=${FRONTEND_URL}
```

## Running the application

### Start database (required)

Docker must be running.

```
docker compose up -d
```

### Run backend:

```
cd backend/
mvn spring-boot:run
```

### Run Frontend:

First install dependencies (only needed once or after changes to package.json):

```
cd frontend/
npm install
```

Then start development server:

```
npm run dev
```

# Notes

### .env is required to run the application

- Never commit .env to version control.
- .env.example is only a template
- Missing variables will cause startup failure

# Frontend

> React, Vite

### Backend engineers: Lauri Musto, Imran Shiundu

### Frontend engineered by Ryan Hughes

