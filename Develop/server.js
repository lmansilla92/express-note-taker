// Import express.js
const express = require('express');

// Import path package from node to resolve paths of files on the server
const path = require('path');

// Initialize an instance of express.js
const app = express();

// Declares the notesData by requiring the db.json file in the db directory
const notesData = require('./db/db.json');

// Sepcifies the PORT on which the server will run, Checks PORT number in an environment variable using process.env.PORT
const PORT = process.env.PORT || 3001;

// Static middleware for the public folder
app.use(express.static('public'));

// Creates routes for different end points
app.get('/', (req, res) => 
    res.sendFile(path.join(__dirname, 'public/index.html'))
);

// Creates route to serve the notes.html
app.get('/notes', (req, res) =>
    res.sendFile(path.join(__dirname, 'public/notes.html'))
);

app.get('/api/notes', (req, res) =>
    res.json(notesData)
);

// Use listen() method for the server to listen on the specified port
app.listen(PORT, () =>
    console.log(`Express server listening at http://localhost:${PORT}`)
);