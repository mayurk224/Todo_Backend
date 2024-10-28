const express = require("express");
const { MongoClient } = require("mongodb"); // Destructure MongoClient
const cors = require("cors");
require("dotenv").config();

const app = express();
app.use(
  cors({
    origin: "https://todo-frontend-chi-rouge.vercel.app/",
  })
);
app.use(express.json()); // Enable JSON parsing middleware

const CONNECTION_STRING = process.env.MONGODB_URI;

const DATABASE = "todoappdb";
let database; // Store the database instance

// Function to connect to MongoDB
async function connectToMongoDB() {
  try {
    const client = await MongoClient.connect(CONNECTION_STRING);
    database = client.db(DATABASE);
    console.log("MongoDB connection established");

    // Start the Express server after MongoDB is connected
    app.listen(5030, () => {
      console.log("Server is running on port 5030");
    });
  } catch (error) {
    console.error("Failed to connect to MongoDB:", error);
    process.exit(1); // Exit process if DB connection fails
  }
}

// Call the function to connect to MongoDB
connectToMongoDB();

// API to get notes from the collection
app.get("/api/todoapp/GetNotes", async (req, res) => {
  try {
    const notes = await database
      .collection("todoappcollection")
      .find({})
      .toArray();
    res.status(200).json(notes); // Send notes as JSON
  } catch (err) {
    console.error("Error fetching notes:", err);
    res.status(500).json({ error: "Failed to fetch notes" });
  }
});

app.post("/api/todoapp/AddNotes", async (req, res) => {
  try {
    // Count the existing documents to generate a new ID
    const noOfDocs = await database
      .collection("todoappcollection")
      .countDocuments({});

    // Insert the new note
    const result = await database.collection("todoappcollection").insertOne({
      id: (noOfDocs + 1).toString(),
      description: req.body.newNotes,
    });

    if (result.acknowledged) {
      res.status(201).json({ message: "Note added successfully" });
    } else {
      res.status(500).json({ error: "Failed to add note" });
    }
  } catch (error) {
    console.error("Error adding note:", error);
    res.status(500).json({ error: "An error occurred while adding the note" });
  }
});

app.delete("/api/todoapp/DeleteNotes", async (req, res) => {
  try {
    const result = await database.collection("todoappcollection").deleteOne({
      id: req.query.id,
    });

    if (result.deletedCount === 1) {
      res.json({ message: "Note deleted successfully" });
    } else {
      res.status(404).json({ error: "Note not found" });
    }
  } catch (error) {
    console.error("Error deleting note:", error);
    res
      .status(500)
      .json({ error: "An error occurred while deleting the note" });
  }
});
