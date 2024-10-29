# Todo App Backend

This is the backend service for the Todo App. It is built using **Node.js** and **Express** and connects to a **MongoDB database** to perform CRUD operations on notes. It also handles **CORS** to allow communication with the frontend deployed on **Vercel**.

## Table of Contents
- [Prerequisites](#prerequisites)
- [Environment Variables](#environment-variables)
- [Installation](#installation)
- [Running the Server](#running-the-server)
- [API Endpoints](#api-endpoints)
- [Deployment](#deployment)
- [Frontend Repository](#frontend-repository)
- [License](#license)
- [Troubleshooting](#troubleshooting)
- [Contact](#contact)

## Prerequisites

Make sure you have the following installed:

- **Node.js** (v16 or higher)
- **MongoDB Database** (Cloud or Local)
- A **.env** file with the required environment variables (see below).

## Environment Variables

Create a **.env** file in the root directory with the following keys:

```makefile
MONGODB_URI=<your-mongodb-connection-string>
DATABASE_NAME=`Your DB name here`
COLLECTION_NAME=`Your DB collection name here`
```

> Replace `<your-mongodb-connection-string>` with the URI for your MongoDB instance.

## Installation

1. Clone the repository:

    ```bash
    git clone <repository-url>
    cd <repository-folder>
    ```

2. Install dependencies:

    ```bash
    npm install
    ```

## Running the Server

To run the server locally, follow these steps:

1. Start your **MongoDB** instance if using a local MongoDB database.
2. Run the server:

    ```bash
    node index.js
    ```

The server will start on **http://localhost:5030** by default.

## API Endpoints

### 1. Get All Notes
- **Endpoint:** `/api/todoapp/GetNotes`
- **Method:** `GET`
- **Description:** Fetches all notes from the database.

**Response:**
```json
[
  {
    "id": "1",
    "description": "Sample note",
    "createdAt": "2024-10-28T12:00:00.000Z"
  }
]
```

### 2. Add a New Note
- **Endpoint:** `/api/todoapp/AddNotes`
- **Method:** `POST`
- **Description:** Adds a new note to the database.

**Request Body:**  
Send as **multipart/form-data**:
```
newNotes: <Note content>
```

**Response:**
```json
{
  "message": "Note added successfully",
  "id": "1"
}
```

### 3. Delete a Note
- **Endpoint:** `/api/todoapp/DeleteNotes`
- **Method:** `DELETE`
- **Query Parameter:**  
  - `id`: ID of the note to delete

**Response:**
```json
{
  "message": "Note deleted successfully"
}
```

## Deployment

This backend can be deployed on **Render** or any other Node-compatible cloud platform. For example:

1. Create a new web service on Render.
2. Connect your repository.
3. Set the required environment variables under the service's settings.
4. Deploy the service.

## Frontend Repository

The frontend of this Todo App is deployed on **Vercel**.  
Check out the **[Todo App Frontend Repository](https://github.com/mayurk224/Todo_Frontend)** for more details.

## CORS Setup

The backend uses the following CORS configuration to allow only your Vercel frontend:

```javascript
app.use(
  cors({
    origin: "your vercel site here",
    methods: ["GET", "POST", "DELETE"],
  })
);
```

Make sure to update the **`origin`** in case your frontend's URL changes.

## License

This project is licensed under the MIT License.

## Troubleshooting

- If you encounter **CORS issues**, ensure your frontend and backend URLs are correct.
- Check your **MongoDB connection string** if the backend fails to connect to the database.
- Verify that **environment variables** are set correctly for both local development and deployment.

## Contact

If you have any questions or need support, feel free to reach out to **Mayur Dilip Kamble** at `mayurkamble0250@gmail.com`.
