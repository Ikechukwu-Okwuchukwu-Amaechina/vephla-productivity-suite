# Vephla Productivity Suite (Backend)

The **Vephla Productivity Suite** is a feature-rich backend ecosystem designed to streamline workflow management. It provides secure user authentication, task and note management, file handling, and real-time communication capabilities.

---

## Key Features

* **Secure Authentication**

  * JWT-based login and registration
  * Password hashing with bcrypt

* **Role-Based Access Control (RBAC)**

  * Tiered access for Admin and Standard users

* **Hybrid API Design**

  * RESTful CRUD APIs for Notes, Tasks, and Files
  * GraphQL endpoint for flexible and optimized data querying

* **Real-Time Engine**

  * Integrated Socket.io for live chat broadcasting
  * Instant task notifications

* **File Management**

  * Profile image uploads
  * Document uploads

* **Data Persistence**

  * MongoDB with Mongoose for structured data modeling

---

## Tech Stack

* Runtime: Node.js
* Framework: Express.js
* Database: MongoDB (Atlas or Local)
* Real-Time: Socket.io
* Query Language: GraphQL
* Authentication: JSON Web Tokens (JWT), Bcrypt
* Documentation: Swagger, Postman

---

## Project Structure

```text
├── config/             # Database and environment configurations
├── controllers/        # Business logic for REST routes
├── middleware/         # Authentication, RBAC, and error handling
├── models/             # Mongoose schemas (User, Note, Task, etc.)
├── graphql/            # GraphQL type definitions and resolvers
├── routes/             # Express route definitions
├── uploads/            # Local storage for uploaded files
├── server.js           # Application entry point and Socket.io setup
└── .env                # Environment variables
```

---

## Getting Started

### Prerequisites

* Node.js v16 or higher
* MongoDB Atlas account or local MongoDB instance

---

### Installation

1. Clone the repository

   ```bash
   git clone https://github.com/your-username/vephla-productivity-suite.git
   cd vephla-productivity-suite
   ```

2. Install dependencies

   ```bash
   npm install
   ```

3. Environment setup

   Create a `.env` file in the root directory:

   ```env
   PORT=5000
   MONGO_URI=your_mongodb_connection_string
   JWT_SECRET=your_super_secret_key
   SESSION_SECRET=your_session_secret_key
   CLOUDINARY_CLOUD_NAME=your_cloudinary_cloud_name
   CLOUDINARY_API_KEY=your_cloudinary_api_key
   CLOUDINARY_API_SECRET=your_cloudinary_api_secret
   ```

   **Setting up Cloudinary:**
   1. Sign up at [cloudinary.com](https://cloudinary.com)
   2. Go to your Dashboard
   3. Copy your Cloud Name, API Key, and API Secret
   4. Paste them into the `.env` file

4. Run the application

   ```bash
   # Development mode
   npm run dev

   # Production mode
   npm start
   ```

---

## API Endpoints (Quick Reference)

### REST API

| Method | Endpoint             | Description              | Access     |
| -----: | -------------------- | ------------------------ | ---------- |
|   POST | `/api/auth/register` | User registration        | Public     |
|   POST | `/api/auth/login`    | User login (returns JWT) | Public     |
|    GET | `/api/notes`         | Fetch all user notes     | Private    |
|   POST | `/api/notes`         | Create a new note        | Private    |
|    GET | `/api/notes/:id`     | Fetch a specific note    | Private    |
|    PUT | `/api/notes/:id`     | Update a note            | Private    |
| DELETE | `/api/notes/:id`     | Delete a note            | Private    |
|   POST | `/api/tasks`         | Create a new task        | Private    |
|    GET | `/api/tasks`         | Fetch all user tasks     | Private    |
|    GET | `/api/tasks/:id`     | Fetch a specific task    | Private    |
|    PUT | `/api/tasks/:id`     | Update a task            | Private    |
|  PATCH | `/api/tasks/:id/complete` | Mark task as completed | Private    |
| DELETE | `/api/tasks/:id`     | Delete a task            | Private    |
|   POST | `/api/files`         | Upload a file            | Private    |
|    GET | `/api/files`         | Fetch all user files     | Private    |
|    GET | `/api/files/:id`     | Get file info            | Private    |
|    GET | `/api/files/:id/download` | Download a file     | Private    |
| DELETE | `/api/files/:id`     | Delete a file            | Private    |

---

## Detailed Endpoint Documentation

### Authentication

#### Register
```
POST /api/auth/register
Content-Type: application/json

{
  "fullName": "John Doe",
  "email": "john@example.com",
  "password": "securePassword123"
}

Response: { "message": "User registered", "user": {...} }
```

#### Login
```
POST /api/auth/login
Content-Type: application/json

{
  "email": "john@example.com",
  "password": "securePassword123"
}

Response: { "message": "Logged in", "token": "jwt_token_here" }
```

---

### Notes API

#### Create Note
```
POST /api/notes
Authorization: Bearer <token>
Content-Type: application/json

{
  "title": "My First Note",
  "content": "This is the note content",
  "tags": ["important", "work"]
}

Response: { "message": "Note created", "note": {...} }
```

#### Get All Notes (with optional filtering)
```
GET /api/notes
Authorization: Bearer <token>

Query Parameters:
- tag: Filter by tag (optional)
- page: Page number (default: 1)
- limit: Results per page (default: 10)

Example: GET /api/notes?tag=work&page=1&limit=10

Response: {
  "notes": [...],
  "pagination": { "page": 1, "limit": 10, "total": 25, "pages": 3 }
}
```

#### Get Single Note
```
GET /api/notes/:id
Authorization: Bearer <token>

Response: { ...note }
```

#### Update Note
```
PUT /api/notes/:id
Authorization: Bearer <token>
Content-Type: application/json

{
  "title": "Updated Title",
  "content": "Updated content",
  "tags": ["updated", "tag"]
}

Response: { "message": "Note updated", "note": {...} }
```

#### Delete Note
```
DELETE /api/notes/:id
Authorization: Bearer <token>

Response: { "message": "Note deleted", "note": {...} }
```

---

### Tasks API

#### Create Task
```
POST /api/tasks
Authorization: Bearer <token>
Content-Type: application/json

{
  "title": "Complete project",
  "description": "Finish the CRUD modules",
  "dueDate": "2026-02-10",
  "assignedTo": "user_id_here" (optional)
}

Response: { "message": "Task created", "task": {...} }
```

#### Get All Tasks (with optional filtering)
```
GET /api/tasks
Authorization: Bearer <token>

Query Parameters:
- completed: Filter by status true/false (optional)
- page: Page number (default: 1)
- limit: Results per page (default: 10)

Example: GET /api/tasks?completed=false&page=1

Response: {
  "tasks": [...],
  "pagination": { "page": 1, "limit": 10, "total": 15, "pages": 2 }
}
```

#### Get Single Task
```
GET /api/tasks/:id
Authorization: Bearer <token>

Response: { ...task }
```

#### Update Task
```
PUT /api/tasks/:id
Authorization: Bearer <token>
Content-Type: application/json

{
  "title": "Updated task title",
  "description": "Updated description",
  "completed": false,
  "dueDate": "2026-02-15",
  "assignedTo": "user_id_here"
}

Response: { "message": "Task updated", "task": {...} }
```

#### Mark Task as Completed
```
PATCH /api/tasks/:id/complete
Authorization: Bearer <token>

Response: { "message": "Task marked as completed", "task": {...} }
```

#### Delete Task
```
DELETE /api/tasks/:id
Authorization: Bearer <token>

Response: { "message": "Task deleted", "task": {...} }
```

---

### Files API

#### Upload File (via Cloudinary)
```
POST /api/files
Authorization: Bearer <token>
Content-Type: multipart/form-data

Form Data:
- file: <binary file data>

Response: { 
  "message": "File uploaded", 
  "file": {
    "_id": "...",
    "filename": "cloudinary_filename",
    "originalName": "myfile.pdf",
    "cloudinaryUrl": "https://res.cloudinary.com/...",
    "cloudinaryPublicId": "vps-uploads/...",
    "mimeType": "application/pdf",
    "size": 1024,
    "userId": "...",
    "uploadedAt": "2026-01-10T..."
  }
}
```

#### Get All Files
```
GET /api/files
Authorization: Bearer <token>

Query Parameters:
- page: Page number (default: 1)
- limit: Results per page (default: 10)

Response: {
  "files": [...],
  "pagination": { "page": 1, "limit": 10, "total": 5, "pages": 1 }
}
```

#### Get File Info
```
GET /api/files/:id
Authorization: Bearer <token>

Response: { ...file }
```

#### Delete File
```
DELETE /api/files/:id
Authorization: Bearer <token>

Response: { "message": "File deleted", "file": {...} }
```

---

### GraphQL

* Endpoint: `/graphql`
* Capabilities:

  * Query notes and tasks
  * Select specific fields to reduce over-fetching

---

## Real-Time Events (Socket.io)

| Event          | Description                                    |
| -------------- | ---------------------------------------------- |
| `connection`   | Initializes user session                       |
| `message`      | Broadcasts chat messages                       |
| `notification` | Triggered when a task is assigned or completed |
| `typing`       | Indicates when a user is typing                |

---

## Documentation and Testing

* Postman
  Exported collection available at:

  ```
  /docs/postman_collection.json
  ```

* Swagger
  Interactive API documentation:

  ```
  http://localhost:5000/api-docs
  ```

* ERD
  Entity Relationship Diagram located in:

  ```
  /docs
  ```

---

## License

Distributed under the MIT License.
See the `LICENSE` file for more information.
