const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const path = require('path');
require('dotenv').config({ path: path.resolve(__dirname, '../../.env') });

const app = express();

// Middleware
app.use(cors());
app.use(express.json());

// The "Hello World" Route
app.get('/api/hello', (req, res) => {
  res.json({ message: "Hello from the MERN Server!" });
});

// Database Connection
const PORT = process.env.PORT || 5000;

mongoose.connect(process.env.MONGO_URI)
  .then(() => {
    console.log("MongoDB Connected");
    app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
  })
  .catch(err => console.log("DB Connection Error:", err));

  const userSchema = new mongoose.Schema({
    number: { type: Number, required: true, unique: true },
    name: { type: String, required: true },
    date: { type: String, required: true },
    title: { type: String, required: true },
    entry: { type: String, required: true },
  });
  
  const User = mongoose.model('User', userSchema);

app.post('/api/entries', async (req, res) => {
  try {
    const { number, name, date, title, entry } = req.body;
    const savedEntry = await User.findOneAndUpdate(
      { number },
      { number, name, date, title, entry },
      { returnDocument: 'after', upsert: true, runValidators: true }
    );
    res.status(201).json({ message: 'Entry saved', entry: savedEntry });
  } catch (err) {
    res.status(500).json({ message: 'Failed to save entry', error: err.message });
  }
});

app.get('/api/entries/:number', async (req, res) => {
  try {
    const entryNumber = Number.parseInt(req.params.number, 10);
    if (Number.isNaN(entryNumber) || entryNumber < 1) {
      return res.status(400).json({ message: 'Entry number must be a positive integer' });
    }

    const entry = await User.findOne({ number: entryNumber });
    return res.status(200).json({ entry: entry || null });
  } catch (err) {
    return res.status(500).json({ message: 'Failed to load entry', error: err.message });
  }
});