# Backend Setup

This is a Spring Boot backend application using environment variables for configuration. Sensitive data is not stored in the repository.

## Prerequisites

- Java 17+
- Maven
- PostgreSQL

## Environment setup

>Create a file called .env in backend/ directory.
>OR
>Copy .env.example and rename it to .env.

Fill in values manually.

## .env.example
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
## How it works

Spring Boot reads environment variables using ${VARIABLE_NAME} in application.properties.

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
## Running

Start PostgreSQL:
docker compose up -d

Run backend:
mvn spring-boot:run

## Notes

.env.example is a template  
Missing variables will break startup





# Frontend

>React, Vite


### Backend engineers: Lauri Musto, Imran Shiundu
### Frontend engineered by Ryan Hughes

