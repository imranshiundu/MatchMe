# Match-Me Web
A full-stack recommendation application, to connect users based on their profile information.<br>
It allows users to:
- Register an account
- View potential matches
- Connect with other users
- Chat with connections
## Quick links:
- [Setup](#backend-setup)
- [Starting](#running-the-application)
- [Usage](#frontend-usage)
- [Contributors](#contributors)
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

### .env.example
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

### How it works

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

# Frontend Usage
>Built using TypeScript, React & Tailwind

### The frontend is run on http://localhost:5173
## / (root)

Here you can find the landing page where you can either log in or register.<br>
Registering will send you to the main app.<br>
Pressing Login will redirect you to the login page (`/login`), and once logged in, you will also be redirected.
>Note: Once in the main app, you can use the icons in the header to traverse the pages

## /match
At the bottom of the page you will see a footer with two options:
- suggestions
- requests
These let you see new profiles that you can connect with and who has sent you a request

### Suggestions
> To begin seeing suggestions you need to first complete your profile.

Here you will see a maximum of 10 suggested profiles at a time.<br>
Using the `next` and `previous` page buttons you can see even more.

#### Suggested User Cards
Each suggestion will be visible as a card containing:
- The user's profile picture
- The user's name
- Interests that you both have in common
- A `Hide` button
  - This will prevent this user from being seen in your suggestions again
- A `View` button
  - This will redirect you to their profile overview (`/match/:id`) if you want to see more of their details
- A `Connect` button
  - This will send the user a connection request

### Incoming Requests
Here you will see requests from users wishing to connect with you.<br>
Each request has its own user card.

#### Request Cards
When you received a request, you'll see a card that contains:
- The user's profile picture
- The user's name
- A `View` button
- A `Reject` button
  - This will reject the user's connection request
- An `Accept` button
  - This will accept the user's connection request
  - When clicked, the card will disappear, and then you will find your new friend in your connections tab (`/connections`)

## /connections
This page fetches all your connections and displays a card for each one.<br>
They are sorted in order of most recent chat activity, meaning if you send or receive a message, that user will appear first in the list until a new message is sent to another user.

### Connection Card
Each connections card contains:
- Their profile picture
- Their name
- The lastest message / new message notification
- `View` button to see their profile (`/connections/user/:id`)
  - When viewing a connections profile, you will see two additional buttons:
    - `Remove` to delete the connection
    - `Message` to open your chat
- `Message` button to open your chat view for that user

### Chat View
Here you can view all previous messages that you had with your connection and send new ones
> Messages are sent through websockets<br>
> Meaning, that if both users looking at the chat window they will see the new message at the same time. 

## /me
### Profile Overview
The first page you see is your own profile information:
- Profile picture
- Nickname
- Age
- Gender
- Location
- Bio
- Interests
- Looking for

### Edit Profile
To update your profile information, you need to click the edit button which can be found under your displayed name.<br>
Once clicked, you'll see the "Edit profile" view.

Here you can change all the aforementioned details.
> NB! To start receiving connection suggestions, you must first update all your profile details!

Once you have filled out all the fields, pressed the `submit` button to save your changes and go back to your profile overview.

## Logout
In the header, there is a logout button on the far right-hand side.<br>This will clear your any session data you have and redirect you back to the login screen.

# Contributors
Backend engineered by Lauri Musto & Imran Shiundu<br>
Frontend engineered by Ryan Hughes
>These were the main focus areas but everyone contributed to both the frontend and backend code!

