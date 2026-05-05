# Match-Me Web
A full-stack recommendation application, to connect users based on their profile information.<br>
It allows users to:
- Register an account
- View potential matches
- Connect with other users
- Chat with connections
## Quick links:
- [Automated Setup](#automated-setup-one-click)
- [Setup](#backend-setup)
- [Starting](#running-the-application)
- [Usage](#frontend-usage)
- [Contributors](#contributors)

# Automated Setup (One-Click)

For a quick and automated setup on all platforms, use the provided installation scripts. These scripts check for dependencies, start the database, build the backend, and launch the frontend.

### Linux & macOS
```bash
chmod +x install.sh
./install.sh
```

### Windows
Run the `install.bat` file from your terminal or by double-clicking it in File Explorer.

---
# Manual Installation & Setup

If you prefer to set up the system manually, follow these steps.

## Prerequisites
- **Java 17+**: Required for the backend.
- **Node.js (v18+)**: Required for the frontend.
- **Docker**: Required to run the PostgreSQL database via Compose.
- **Maven**: (Optional) The project includes `./mvnw` wrapper.

## Step-by-Step Setup

### 1. Database
The system uses PostgreSQL 16. Start it using the provided Docker configuration:
```bash
docker compose up -d
```
The database will be available at `127.0.0.1:5433`.

### 2. Backend
Navigate to the backend directory and configure your environment:
```bash
cd backend
# Create .env from example (Update with your secrets if needed)
cp .env.example .env

# Build the application
./mvnw clean package -DskipTests

# Start the application
java -jar target/backend-0.0.1-SNAPSHOT.jar
```
The API will be available at `http://localhost:8085`.

### 3. Frontend
Navigate to the frontend directory and start the development server:
```bash
cd frontend
npm install
npm run dev
```
The UI will be available at `http://localhost:5173`.

# Testing the System

## Automated Tests
The backend includes a suite of unit and integration tests to ensure system stability.

### Running Backend Tests
```bash
cd backend
./mvnw test
```

## Manual Testing & Verification
To verify the social features and discovery logic:

1. **User Discovery**: Use the search bar in the header to find users by nickname or tech stack.
2. **Social Feed**: Create a post and verify it appears in the "Feed" tab.
3. **Follow Logic**: Navigate to a user's profile and click "Follow". The button should transition to "Pending".
4. **Connections**: Accept a request in the "Requests" tab and verify the user appears in your "Connections" list.
5. **Real-Time Chat**: Open a connection and send a message. If the other user is online, they will see the message instantly via WebSockets.

# Social Features Summary
- **Feed**: A central hub for sharing thoughts and updates with the community.
- **MatchMe Logic**: A recommendation engine that suggests users based on location and shared interests (Relaxed logic ensures the feed is never empty).
- **Interactions**: Like posts, follow developers, and engage in real-time professional networking.

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

