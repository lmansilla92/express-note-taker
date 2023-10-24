// Import express.js
const express = require('express');

// Import path package from node to resolve paths of files on the server
const path = require('path');

// Initialize an instance of express.js
const app = express();

// Sepcifies the PORT on which the server will run
const PORT = 3001;

// Static middleware for the public folder
app.use(express.static('public'));

// Creates routes for different end points
app.get('/', (req, res) => 
    res.sendFile(path.join(__dirname, 'public/index.html'))
);

// Use listen() method for the service to listen on the specified port
app.listen(PORT, () =>
    console.log(`Express server listening at http://localhost:${PORT}`)
);