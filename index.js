const express = require("express");
const { MongoClient } = require("mongodb");
const cors = require("cors");
const multer = require("multer");
require("dotenv").config();

const CONNECTION_STRING = process.env.MONGODB_URI;
const DATABASE_NAME = process.env.DATABASE_NAME;
const COLLECTION_NAME = process.env.COLLECTION_NAME;

const app = express();
const upload = multer(); // Initialize Multer

let database;

// Middleware
app.use(cors()); // Handle CORS
app.use(express.json()); // Parse JSON request bodies

// Connect to MongoDB and Start Server
MongoClient.connect(CONNECTION_STRING, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
})
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
    const notes = await database.collection(COLLECTION_NAME).find({}).toArray();
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

    if (!newNotes) {
      return res.status(400).json({ error: "Note content is required" });
    }

    // Find the highest id in the collection and increment it
    const lastNote = await database
      .collection(COLLECTION_NAME)
      .find({})
      .sort({ id: -1 }) // Sort by id in descending order
      .limit(1) // Get the latest note
      .toArray();

    const newId = lastNote.length > 0 ? parseInt(lastNote[0].id) + 1 : 1;

    const newNote = {
      id: newId.toString(), // Store the incremented id as a string
      description: newNotes,
      createdAt: new Date(), // Optional: Add a timestamp
    };

    const result = await database
      .collection(COLLECTION_NAME)
      .insertOne(newNote);

    res.status(201).json({
      message: "Note added successfully",
      id: result.insertedId,
    });
  } catch (err) {
    console.error("Failed to add note:", err);
    res.status(500).json({ error: "Failed to add note" });
  }
});

// Delete Note Endpoint
app.delete("/api/todoapp/DeleteNotes", async (req, res) => {
  try {
    const { id } = req.query;

    if (!id) {
      return res.status(400).json({ error: "Note ID is required" });
    }

    // Delete the note using the 'id' field (stored as a string)
    const result = await database
      .collection(COLLECTION_NAME)
      .deleteOne({ id: id });

    if (result.deletedCount === 0) {
      return res.status(404).json({ error: "Note not found" });
    }

    res.json({ message: "Note deleted successfully" });
  } catch (err) {
    console.error("Failed to delete note:", err);
    res.status(500).json({ error: "Failed to delete note" });
  }
});
