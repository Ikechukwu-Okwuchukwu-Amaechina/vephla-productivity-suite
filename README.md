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
   ```

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
|   POST | `/api/tasks`         | Create a new task        | Private    |
|   POST | `/api/files/upload`  | Upload document or image | Private    |
|    GET | `/api/admin/logs`    | View system logs         | Admin Only |

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
