// server.js
const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const cors = require('cors'); // To allow cross-origin requests from AngularJS

const app = express();
app.use(bodyParser.json());
app.use(cors());

// Connect to MongoDB (Replace <db_password> with your MongoDB password)
const dbURI = "mongodb://localhost:27017/shopping";


mongoose.connect(dbURI, { useNewUrlParser: true, useUnifiedTopology: true })
  .then(() => console.log('MongoDB connected'))
  .catch(err => console.log(err));

// Define a schema and model for the cart items
const itemSchema = new mongoose.Schema({
  name: String,
  quantity: String
});

const Item = mongoose.model('Item', itemSchema);

// API Routes
// 1. Add an item
app.post('/add-item', async (req, res) => {
  const { name, quantity } = req.body;
  const newItem = new Item({ name, quantity });
  await newItem.save();
  res.json({ message: 'Item added successfully' });
});

// 2. Get all items
app.get('/get-items', async (req, res) => {
  const items = await Item.find();
  res.json(items);
});

// 3. Delete an item
app.delete('/remove-item/:id', async (req, res) => {
  const { id } = req.params;
  await Item.findByIdAndDelete(id);
  res.json({ message: 'Item removed successfully' });
});

// Start the server
const PORT = process.env.PORT || 3001;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
