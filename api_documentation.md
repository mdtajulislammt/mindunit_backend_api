# MindUnite Platform API Integration Documentation

This document describes the request/response payloads for integrating the frontend slice actions and UI views with the NestJS backend endpoints.

## Global Configurations

- **API Base URL**: `http://localhost:5001/api`
- **Swagger Documentation UI**: `http://localhost:5001/api/docs`
- **Authorization**: All endpoints (except Auth) require the header `Authorization: Bearer <JWT_TOKEN>`.

---

## 1. Authentication Module (`/auth`)

### Register User
* **Method & Path**: `POST /api/auth/register`
* **Request Header**: `Content-Type: application/json`
* **Request Body**:
```json
{
  "firstName": "Sarah",
  "lastName": "Rahman",
  "email": "sarah@mindunite.org",
  "password": "password123"
}
```
* **Response Body (201 Created)**:
```json
{
  "user": {
    "id": "517efdbe-5b23-455b-bf98-63625f6b21ba",
    "firstName": "Sarah",
    "lastName": "Rahman",
    "email": "sarah@mindunite.org",
    "headline": "Brain Health Enthusiast | MindUnite Member",
    "avatarUrl": null,
    "connectionsCount": 0,
    "createdAt": "2026-07-01T10:00:00.000Z",
    "updatedAt": "2026-07-01T10:00:00.000Z"
  },
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "accessToken": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
}
```

### Login User
* **Method & Path**: `POST /api/auth/login`
* **Request Header**: `Content-Type: application/json`
* **Request Body**:
```json
{
  "email": "sarah@mindunite.org",
  "password": "password123"
}
```
* **Response Body (201 Created)**: Same JSON model as Registration.

---

## 2. Users & Network Directory Module (`/users`)

### Get Professionals Directory
* **Method & Path**: `GET /api/users/directory`
* **Request Header**: `Authorization: Bearer <JWT_TOKEN>`
* **Response Body (200 OK)**:
```json
[
  {
    "id": "e22a5789-f567-4221-a75d-31b32fe8923a",
    "firstName": "Rahat",
    "lastName": "Islam",
    "email": "rahat@mindunite.org",
    "headline": "Psychology Student at RU | Aspiring Neuro-therapist",
    "avatarUrl": "https://images.unsplash.com/...",
    "connectionsCount": 0,
    "createdAt": "2026-07-01T10:00:00.000Z",
    "updatedAt": "2026-07-01T10:00:00.000Z",
    "connectionStatus": "CONNECT"
  }
]
```

### Get My Profile (Logged-in User Profile)
* **Method & Path**: `GET /api/users/profile`
* **Request Header**: `Authorization: Bearer <JWT_TOKEN>`
* **Response Body (200 OK)**: Returns the user profile details, their posts, connections list, and joined groups.
```json
{
  "user": {
    "id": "517efdbe-5b23-455b-bf98-63625f6b21ba",
    "firstName": "Sarah",
    "lastName": "Rahman",
    "email": "sarah@mindunite.org",
    "headline": "Brain Health Enthusiast | MindUnite Member",
    "avatarUrl": null,
    "connectionsCount": 12,
    "createdAt": "2026-07-01T10:00:00.000Z",
    "updatedAt": "2026-07-01T10:00:00.000Z"
  },
  "posts": [
    {
      "id": "84c8a2b5-12cf-4b9b-98ee-1a967ad781ff",
      "content": "Excited to share the updated design token mapping!",
      "imageUrl": "http://localhost:5001/public/uploads/1719812400-image.png (or null)",
      "privacy": "public",
      "createdAt": "2026-07-01T10:00:00.000Z",
      "author": {
        "id": "517efdbe-5b23-455b-bf98-63625f6b21ba",
        "firstName": "Sarah",
        "lastName": "Rahman"
      },
      "likes": [],
      "comments": []
    }
  ],
  "joinedGroups": [
    {
      "id": "d13efdbe-1b23-355b-bf98-63625f6b21aa",
      "name": "Figma Product Community",
      "category": "Design & Systems",
      "avatarUrl": "https://images.unsplash.com/...",
      "membersCount": 84200,
      "createdAt": "2026-07-01T10:00:00.000Z",
      "isJoined": true
    }
  ],
  "connections": [
    {
      "id": "e22a5789-f567-4221-a75d-31b32fe8923a",
      "firstName": "Rahat",
      "lastName": "Islam",
      "headline": "Psychology Student...",
      "avatarUrl": "https://..."
    }
  ]
}
```

### Get Another User Profile
* **Method & Path**: `GET /api/users/:id/profile`
* **Request Header**: `Authorization: Bearer <JWT_TOKEN>`
* **Response Body (200 OK)**: Same structure as `GET /api/users/profile`, containing the target user's details, posts, and memberships.

### Update Profile (Supports Raw Avatar File or JSON)
* **Method & Path**: `PUT /api/users/profile`
* **Request Header**: `Authorization: Bearer <JWT_TOKEN>`
* **Request Body (Multipart Form or JSON)**:
  - `firstName`: "Sarah" (Optional)
  - `lastName`: "Rahman" (Optional)
  - `headline`: "Updated headline" (Optional)
  - `avatar`: Raw avatar image file (Optional, via `multipart/form-data` file selector)
  - `avatarUrl`: "http://..." (Optional, if setting directly via JSON)
* **Response Body (200 OK)**:
```json
{
  "id": "517efdbe-5b23-455b-bf98-63625f6b21ba",
  "firstName": "Sarah",
  "lastName": "Rahman",
  "email": "sarah@mindunite.org",
  "headline": "Updated headline",
  "avatarUrl": "http://localhost:5001/public/uploads/new-avatar.png",
  "connectionsCount": 12,
  "createdAt": "2026-07-01T10:00:00.000Z",
  "updatedAt": "2026-07-02T11:30:00.000Z"
}
```

---

## 3. Posts & News Feed Module (`/posts`)

### Retrieve News Feed
* **Method & Path**: `GET /api/posts`
* **Request Header**: `Authorization: Bearer <JWT_TOKEN>`
* **Response Body (200 OK)**:
```json
[
  {
    "id": "84c8a2b5-12cf-4b9b-98ee-1a967ad781ff",
    "content": "Excited to share the updated design token mapping!",
    "imageUrl": "http://localhost:5001/public/uploads/1719812400-image.png (or null)",
    "privacy": "public",
    "createdAt": "2026-07-01T10:00:00.000Z",
    "author": {
      "id": "517efdbe-5b23-455b-bf98-63625f6b21ba",
      "firstName": "Sarah",
      "lastName": "Rahman",
      "email": "sarah@mindunite.org",
      "headline": "Cognitive Neuroscientist...",
      "avatarUrl": "https://images.unsplash.com/..."
    },
    "likes": [
      "e22a5789-f567-4221-a75d-31b32fe8923a"
    ],
    "comments": [
      {
        "id": "c11a689b-734d-45bf-97ea-127dbcae58a2",
        "content": "This makes so much sense, Dr. Sarah!",
        "createdAt": "2026-07-01T10:05:00.000Z",
        "author": {
          "id": "e22a5789-f567-4221-a75d-31b32fe8923a",
          "firstName": "Rahat",
          "lastName": "Islam"
        },
        "likes": [
          "517efdbe-5b23-455b-bf98-63625f6b21ba"
        ],
        "replies": [
          {
            "id": "r25a6ef9-81a2-4aef-79c2-25e2dca7e1b5",
            "content": "Thanks, Rahat!",
            "createdAt": "2026-07-01T10:06:00.000Z",
            "author": {
              "id": "517efdbe-5b23-455b-bf98-63625f6b21ba",
              "firstName": "Sarah",
              "lastName": "Rahman"
            },
            "likes": [
              "e22a5789-f567-4221-a75d-31b32fe8923a"
            ]
          }
        ]
      }
    ]
  }
]
```

### Create Post (Supports Raw Image File or Text)
* **Method & Path**: `POST /api/posts`
* **Request Header**: `Authorization: Bearer <JWT_TOKEN>`
* **Request Body (Multipart Form or JSON)**:
  - `content`: "Post text content" (Required)
  - `privacy`: "public" or "private" (Optional, defaults to "public")
  - `image`: Raw image file (Optional, via `multipart/form-data` file selector)
  - `imageUrl`: "http://..." (Optional, if uploading pre-existing image via JSON)
* **Response Body (201 Created)**:
```json
{
  "id": "84c8a2b5-12cf-4b9b-98ee-1a967ad781ff",
  "content": "Post text content",
  "imageUrl": "http://localhost:5001/public/uploads/1719812400-image.png (or null)",
  "privacy": "public",
  "createdAt": "2026-07-01T10:00:00.000Z",
  "author": {
    "id": "517efdbe-5b23-455b-bf98-63625f6b21ba",
    "firstName": "Sarah",
    "lastName": "Rahman"
  },
  "likes": [],
  "comments": []
}
```

### Edit/Update Post (Supports Raw Image File or Text)
* **Method & Path**: `PUT /api/posts/:id`
* **Request Header**: `Authorization: Bearer <JWT_TOKEN>`
* **Request Body (Multipart Form or JSON)**:
  - `content`: "Updated post text content" (Optional)
  - `privacy`: "public" or "private" (Optional)
  - `image`: Raw image file (Optional, via `multipart/form-data` file selector)
  - `imageUrl`: "http://..." (Optional, via JSON payload)
* **Response Body (200 OK)**: Returns the updated post object inside standard structure.
```json
{
  "id": "84c8a2b5-12cf-4b9b-98ee-1a967ad781ff",
  "content": "Updated post text content",
  "imageUrl": "http://localhost:5001/public/uploads/1719812400-image.png (or null)",
  "privacy": "public",
  "createdAt": "2026-07-01T10:00:00.000Z",
  "author": {
    "id": "517efdbe-5b23-455b-bf98-63625f6b21ba",
    "firstName": "Sarah",
    "lastName": "Rahman"
  },
  "likes": [],
  "comments": []
}
```

### Delete Post
* **Method & Path**: `DELETE /api/posts/:id`
* **Request Header**: `Authorization: Bearer <JWT_TOKEN>`
* **Response Body (200 OK)**:
```json
{
  "success": true,
  "message": "Post successfully deleted"
}
```

---

## 4. Engagement Module (Likes, Comments & Replies)

### Toggle Post Like (Like/Dislike)
* **Method & Path**: `POST /api/posts/:id/like`
* **Request Header**: `Authorization: Bearer <JWT_TOKEN>`
* **Response Body (201 Created)**:
```json
{
  "liked": true // Returns false if toggled off (unliked/disliked)
}
```

### Get Post Likers
* **Method & Path**: `GET /api/posts/:id/likes`
* **Request Header**: `Authorization: Bearer <JWT_TOKEN>`
* **Response Body (200 OK)**:
```json
[
  {
    "id": "517efdbe-5b23-455b-bf98-63625f6b21ba",
    "firstName": "Sarah",
    "lastName": "Rahman",
    "headline": "Cognitive Neuroscientist...",
    "avatarUrl": "https://images.unsplash.com/..."
  }
]
```

### Add Comment to Post
* **Method & Path**: `POST /api/posts/:id/comments`
* **Request Header**: `Authorization: Bearer <JWT_TOKEN>, Content-Type: application/json`
* **Request Body**:
```json
{
  "content": "This is an awesome post!"
}
```
* **Response Body (201 Created)**:
```json
{
  "id": "c11a689b-734d-45bf-97ea-127dbcae58a2",
  "content": "This is an awesome post!",
  "createdAt": "2026-07-01T10:05:00.000Z",
  "author": {
    "id": "e22a5789-f567-4221-a75d-31b32fe8923a",
    "firstName": "Rahat",
    "lastName": "Islam"
  },
  "likes": [],
  "replies": []
}
```

### Add Nested Reply to Comment
* **Method & Path**: `POST /api/posts/:postId/comments/:commentId/replies`
* **Request Header**: `Authorization: Bearer <JWT_TOKEN>, Content-Type: application/json`
* **Request Body**:
```json
{
  "content": "I agree completely!"
}
```
* **Response Body (201 Created)**:
```json
{
  "id": "r25a6ef9-81a2-4aef-79c2-25e2dca7e1b5",
  "content": "I agree completely!",
  "createdAt": "2026-07-01T10:06:00.000Z",
  "author": {
    "id": "517efdbe-5b23-455b-bf98-63625f6b21ba",
    "firstName": "Sarah",
    "lastName": "Rahman"
  },
  "likes": []
}
```

### Toggle Comment Like
* **Method & Path**: `POST /api/comments/:id/like`
* **Request Header**: `Authorization: Bearer <JWT_TOKEN>`
* **Response Body (201 Created)**:
```json
{
  "liked": true // Returns false if unliked
}
```

### Toggle Reply Like
* **Method & Path**: `POST /api/replies/:id/like`
* **Request Header**: `Authorization: Bearer <JWT_TOKEN>`
* **Response Body (201 Created)**:
```json
{
  "liked": true // Returns false if unliked
}
```

### Delete Comment
* **Method & Path**: `DELETE /api/comments/:id`
* **Request Header**: `Authorization: Bearer <JWT_TOKEN>`
* **Response Body (200 OK)**:
```json
{
  "success": true,
  "message": "Comment successfully deleted"
}
```

### Delete Comment Reply
* **Method & Path**: `DELETE /api/replies/:id`
* **Request Header**: `Authorization: Bearer <JWT_TOKEN>`
* **Response Body (200 OK)**:
```json
{
  "success": true,
  "message": "Reply successfully deleted"
}
```

---

## 5. Communities Module (`/groups`)

### List Groups
* **Method & Path**: `GET /api/groups`
* **Request Header**: `Authorization: Bearer <JWT_TOKEN>`
* **Response Body (200 OK)**:
```json
[
  {
    "id": "d13efdbe-1b23-355b-bf98-63625f6b21aa",
    "name": "Figma Product Community",
    "category": "Design & Systems",
    "avatarUrl": "https://images.unsplash.com/...",
    "membersCount": 84200,
    "createdAt": "2026-07-01T10:00:00.000Z",
    "isJoined": false
  }
]
```

### Toggle Group Membership (Join/Leave)
* **Method & Path**: `POST /api/groups/:id/join`
* **Request Header**: `Authorization: Bearer <JWT_TOKEN>`
* **Response Body (201 Created)**:
```json
{
  "isJoined": true // Returns false if left
}
```
