# MatchMe API Documentation

This document provides comprehensive documentation for the MatchMe backend API endpoints, including request/response formats, authentication requirements, and data structures. This is intended for frontend developers integrating with the backend.

## Base URL
```
http://localhost:8085
```

## Authentication
Most endpoints require authentication via JWT token in the Authorization header:
```
Authorization: Bearer <token>
```
Tokens are obtained from the login endpoint.

## API Endpoints

### Authentication

#### Register User
- **Endpoint**: `POST /register`
- **Description**: Register a new user account
- **Request Body**:
  ```json
  {
    "email": "string",
    "password": "string",
    "repeatPassword": "string"
  }
  ```
- **Response**:
  ```json
  {
    "id": "number",
    "email": "string",
    "location": "string"
  }
  ```
- **Status Codes**: 201 Created

#### Login
- **Endpoint**: `POST /login`
- **Description**: Authenticate user and get JWT token
- **Request Body**:
  ```json
  {
    "email": "string",
    "password": "string"
  }
  ```
- **Response**:
  ```json
  {
    "token": "string",
    "email": "string",
    "id": "number"
  }
  ```

### User Management

#### Get All Users
- **Endpoint**: `GET /users`
- **Description**: Retrieve all registered users
- **Response**: Array of `RegisterResponseDTO`
- **Auth Required**: Yes

#### Get User by ID
- **Endpoint**: `GET /users/{id}`
- **Description**: Get user summary by ID
- **Response**:
  ```json
  {
    "id": "number",
    "nickname": "string",
    "imageUrl": "string"
  }
  ```
- **Auth Required**: Yes

#### Get User Profile Interests
- **Endpoint**: `GET /users/{id}/profile`
- **Description**: Get user's interests
- **Response**:
  ```json
  {
    "id": "number",
    "interest": "string"
  }
  ```
- **Auth Required**: Yes

#### Get User Bio
- **Endpoint**: `GET /users/{id}/bio`
- **Description**: Get user's bio
- **Response**:
  ```json
  {
    "id": "number",
    "bio": "string"
  }
  ```
- **Auth Required**: Yes

#### Change Email
- **Endpoint**: `PUT /change-email`
- **Description**: Change user's email
- **Request Body**:
  ```json
  {
    "newEmail": "string",
    "currentPassword": "string"
  }
  ```
- **Auth Required**: Yes

#### Change Password
- **Endpoint**: `PUT /change-password`
- **Description**: Change user's password
- **Request Body**:
  ```json
  {
    "newPassword": "string",
    "newRepeatPassword": "string",
    "oldPassword": "string"
  }
  ```
- **Auth Required**: Yes

#### Delete User
- **Endpoint**: `DELETE /delete`
- **Description**: Delete user account
- **Status Codes**: 204 No Content
- **Auth Required**: Yes

### Profile Management

#### Get Current User Profile
- **Endpoint**: `GET /me` or `GET /me/profile` or `GET /me/bio`
- **Description**: Get current user's full profile
- **Response**:
  ```json
  {
    "id": "number",
    "email": "string",
    "nickname": "string",
    "interest": "string",
    "bio": "string",
    "age": "number",
    "gender": "string",
    "lookingFor": "string",
    "imageUrl": "string",
    "publicId": "string",
    "location": "string"
  }
  ```
- **Auth Required**: Yes

#### Get Profile by ID
- **Endpoint**: `GET /profile/{id}`
- **Description**: Get profile by user ID
- **Response**: Same as above
- **Auth Required**: Yes

#### Edit Profile
- **Endpoint**: `PATCH /me/editProfile`
- **Description**: Update current user's profile
- **Request Body**:
  ```json
  {
    "nickname": "string",
    "interest": "string",
    "bio": "string",
    "age": "number",
    "gender": "string",
    "lookingFor": "string",
    "imageUrl": "string",
    "publicId": "string",
    "location": "string"
  }
  ```
- **Response**: Updated profile object
- **Auth Required**: Yes

#### Upload Profile Image
- **Endpoint**: `POST /profile/upload-image`
- **Description**: Upload profile image
- **Request**: Multipart form data with `file` parameter
- **Response**:
  ```json
  {
    "imageUrl": "string"
  }
  ```
- **Auth Required**: Yes

#### Remove Profile Image
- **Endpoint**: `DELETE /profile/remove-image`
- **Description**: Remove profile image
- **Status Codes**: 204 No Content
- **Auth Required**: Yes

### Connections

#### Get Connections
- **Endpoint**: `GET /connections`
- **Description**: Get user's connections
- **Response**: Array of `ConnectionResponseDTO`
  ```json
  [
    {
      "userA": "string",
      "userB": "string",
      "status": "string"
    }
  ]
  ```
- **Auth Required**: Yes

#### Get Recommendations
- **Endpoint**: `GET /recommendations`
- **Description**: Get recommended users for connection
- **Query Params**:
  - `page` (default: 0)
  - `size` (default: 10)
- **Response**:
  ```json
  {
    "ids": ["number"],
    "pageable": {
      "page": "number",
      "size": "number"
    }
  }
  ```
- **Auth Required**: Yes

#### Send Connection Request
- **Endpoint**: `POST /{id}/request`
- **Description**: Send connection request to user {id}
- **Auth Required**: Yes

#### Get Connection Requests
- **Endpoint**: `GET /connection-requests`
- **Description**: Get pending connection requests
- **Response**: Array of `ConnectionResponseDTO`
- **Auth Required**: Yes

#### Accept Connection Request
- **Endpoint**: `POST /connection-requests/{id}/accept`
- **Description**: Accept connection request from user {id}
- **Auth Required**: Yes

#### Dismiss Connection Request
- **Endpoint**: `POST /connection-requests/{id}/dismiss`
- **Description**: Dismiss connection request from user {id}
- **Auth Required**: Yes

#### Delete Connection
- **Endpoint**: `DELETE /connections/{id}`
- **Description**: Remove connection with user {id}
- **Auth Required**: Yes

### Chat

#### Get Chats
- **Endpoint**: `GET /chats`
- **Description**: Get user's chat list
- **Response**: Array of `ChatItemDTO`
  ```json
  [
    {
      "chatId": "number",
      "participantId": "number",
      "participantName": "string",
      "participantPicture": "string",
      "participantOnline": "boolean",
      "lastMessage": "string",
      "lastActivity": "string",
      "unreadCount": "number"
    }
  ]
  ```
- **Auth Required**: Yes

#### Get Chat Messages
- **Endpoint**: `GET /chats/{id}/messages`
- **Description**: Get messages for chat {id}
- **Query Params**:
  - `page` (default: 0)
  - `size` (default: 20)
- **Response**: Array of `ChatMsgDTO`
  ```json
  [
    {
      "id": "number",
      "chatId": "number",
      "senderId": "number",
      "receiverId": "number",
      "content": "string",
      "timestamp": "string",
      "isRead": "boolean"
    }
  ]
  ```
- **Auth Required**: Yes

### Posts

#### Get All Posts
- **Endpoint**: `GET /posts`
- **Description**: Get all posts
- **Response**: Array of `PostResponseDTO`
  ```json
  [
    {
      "id": "number",
      "authorId": "number",
      "authorNickname": "string",
      "authorImageUrl": "string",
      "content": "string",
      "imageUrl": "string",
      "likesCount": "number",
      "createdAt": "string"
    }
  ]
  ```

#### Create Post
- **Endpoint**: `POST /posts`
- **Description**: Create a new post
- **Request Body**:
  ```json
  {
    "content": "string",
    "imageUrl": "string"
  }
  ```
- **Response**: Created `PostResponseDTO`
- **Auth Required**: Yes

## WebSocket Endpoints

### Chat WebSocket
- **Endpoint**: `/ws-chat`
- **Description**: WebSocket endpoint for real-time chat
- **Authentication**: JWT token required

#### Send Message
- **Message Mapping**: `/app/chat.send`
- **Payload**:
  ```json
  {
    "receiverId": "number",
    "content": "string"
  }
  ```
- **Response Topics**:
  - `/topic/chat/{chatId}`: Message broadcast to chat
  - `/user/queue/chats`: Updated chat list for sender and receiver

#### Typing Indicator
- **Message Mapping**: `/app/chat.typing`
- **Payload**:
  ```json
  {
    "toId": "number",
    "typing": "boolean"
  }
  ```
- **Response Topic**: `/user/queue/typing`

## TypeScript Interfaces

For frontend integration, here are the corresponding TypeScript interfaces:

```typescript
// Auth
interface LoginRequest {
  email: string;
  password: string;
}

interface LoginResponse {
  token: string;
  email: string;
  id: number;
}

interface RegisterRequest {
  email: string;
  password: string;
  repeatPassword: string;
}

interface RegisterResponse {
  id: number;
  email: string;
  location: string;
}

// Profile
interface Profile {
  id: number;
  email?: string;
  nickname: string;
  interest: string;
  bio: string;
  age: number;
  gender: string;
  lookingFor: string;
  imageUrl: string;
  publicId: string;
  location: string;
}

interface EditProfileRequest {
  nickname: string;
  interest: string;
  bio: string;
  age: number;
  gender: string;
  lookingFor: string;
  imageUrl: string;
  publicId: string;
  location: string;
}

interface ProfileImageUploadResponse {
  imageUrl: string;
}

// Connections
interface Connection {
  userA: string;
  userB: string;
  status: string;
}

interface RecommendationsResponse {
  ids: number[];
  pageable: {
    page: number;
    size: number;
  };
}

// Chat
interface ChatItem {
  chatId: number;
  participantId: number;
  participantName: string;
  participantPicture: string;
  participantOnline: boolean;
  lastMessage: string;
  lastActivity: string;
  unreadCount: number;
}

interface ChatMessage {
  id: number;
  chatId: number;
  senderId: number;
  receiverId: number;
  content: string;
  timestamp: string;
  isRead: boolean;
}

interface ChatSendRequest {
  receiverId: number;
  content: string;
}

interface TypingRequest {
  toId: number;
  typing: boolean;
}

interface TypingEvent {
  chatId: number;
  fromId: number;
  typing: boolean;
}

// Posts
interface Post {
  id: number;
  authorId: number;
  authorNickname: string;
  authorImageUrl: string;
  content: string;
  imageUrl: string;
  likesCount: number;
  createdAt: string;
}

interface CreatePostRequest {
  content: string;
  imageUrl: string;
}

// User
interface UserSummary {
  id: number;
  nickname: string;
  imageUrl: string;
}

interface UserProfileBio {
  id: number;
  bio: string;
}

interface UserProfileInterest {
  id: number;
  interest: string;
}
```

## Error Handling

The API returns standard HTTP status codes. Common error responses include:

- `400 Bad Request`: Invalid request data
- `401 Unauthorized`: Missing or invalid authentication
- `403 Forbidden`: Insufficient permissions
- `404 Not Found`: Resource not found
- `500 Internal Server Error`: Server error

Error responses may include a JSON body with error details.

## Notes

- All authenticated endpoints require a valid JWT token obtained from login
- Pagination is supported where indicated with `page` and `size` parameters
- WebSocket connections require authentication via JWT token
- File uploads use multipart/form-data encoding
- Dates are returned in ISO 8601 format