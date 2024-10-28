const express = require("express");
const { MongoClient } = require("mongodb");
const cors = require("cors");
const multer = require("multer");
require("dotenv").config();

const CONNECTION_STRING = process.env.MONGODB_URI;
const DATABASE_NAME = "todoappdb";

const app = express();
const upload = multer(); // Initialize Multer

let database;

// Middleware
app.use(cors()); // Handle CORS
app.use(express.json()); // Parse JSON request bodies

// Connect to MongoDB and Start Server
MongoClient.connect(CONNECTION_STRING)
  .then((client) => {
    database = client.db(DATABASE_NAME);
    console.log("Connected to MongoDB");

    app.listen(5030, () => {
      console.log("Server is running on port 5030");
    });
  })
  .catch((err) => {
    console.error("Failed to connect to MongoDB:", err);
    process.exit(1); // Exit if connection fails
  });

// Get Notes Endpoint
app.get("/api/todoapp/GetNotes", async (req, res) => {
  try {
    const notes = await database
      .collection("todoappcollection")
      .find({})
      .toArray();
    res.json(notes);
  } catch (err) {
    console.error("Failed to fetch notes:", err);
    res.status(500).json({ error: "Failed to fetch notes" });
  }
});

// Add Note Endpoint
app.post("/api/todoapp/AddNotes", upload.none(), async (req, res) => {
  try {
    const newNotes = req.body.newNotes;
    const noOfDocs = await database
      .collection("todoappcollection")
      .countDocuments();

    await database.collection("todoappcollection").insertOne({
      id: (noOfDocs + 1).toString(),
      description: newNotes,
    });

    res.json({ message: "Note added successfully" });
  } catch (err) {
    console.error("Failed to add note:", err);
    res.status(500).json({ error: "Failed to add note" });
  }
});

// Delete Note Endpoint
app.delete("/api/todoapp/DeleteNotes", async (req, res) => {
  try {
    const { id } = req.query;
    const result = await database
      .collection("todoappcollection")
      .deleteOne({ id });

    if (result.deletedCount === 0) {
      return res.status(404).json({ error: "Note not found" });
    }

    res.json({ message: "Note deleted successfully" });
  } catch (err) {
    console.error("Failed to delete note:", err);
    res.status(500).json({ error: "Failed to delete note" });
  }
});
