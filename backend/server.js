const express = require('express');
const mongoose = require('mongoose');
const Note = require('./Note');
const cors = require('cors');
const app = express();
app.use(cors());

const uri = 'mongodb+srv://elroy0001:t0110582a@notetaker.7ieu8nu.mongodb.net/?retryWrites=true&w=majority';

mongoose.connect(uri)
  .then(() => console.log("Connected to MongoDB"))
  .catch(error => console.error("Error connecting to MongoDB:", error));

app.use(express.json());

app.get('/notes', async (req, res) => {
  const { userId } = req.query;
  try {
    const userNotes = await Note.find({ userId });
    res.json(userNotes);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

app.post('/notes', async (req, res) => {
  const { title, content, userId } = req.body;
  try {
    const newNote = new Note({ title, content, userId });
    const savedNote = await newNote.save();
    res.status(201).json(savedNote);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

app.delete('/notes/:id', async (req, res) => {
  const { id } = req.params;
  const { userId } = req.query;
  try {
    const noteToDelete = await Note.findOne({ _id: id, userId: userId });
    if (!noteToDelete) {
      return res.status(404).json({ message: 'Note not found or user mismatch' });
    }
    await noteToDelete.remove();
    res.json({ message: 'Note deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

const PORT = process.env.PORT || 3001;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
