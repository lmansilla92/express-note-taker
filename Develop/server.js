// Import express.js
const express = require('express');

// Import path package from node to resolve paths of files on the server
const path = require('path');

// Initialize an instance of express.js
const app = express();

// Adds middleware to parse data to json
app.use(express.json());
// Adds middleware for parsing urlencoded data
app.use(express.urlencoded({ extended: true }));

// Declares the notes by requiring the db.json file in the db directory
const notes = require('./db/db.json');

// Sepcifies the PORT on which the server will run, Checks PORT number in an environment variable using process.env.PORT
const PORT = process.env.PORT || 3001;

// Static middleware for the public folder
app.use(express.static('public'));

// Creates route to serve the notes.html
app.get('/notes', (req, res) =>
    res.sendFile(path.join(__dirname, 'public/notes.html'))
);

// Creates API route to read the db.json file and return all saved notes as JSON
app.get('/api/notes', (req, res) =>
    res.json(notes)
);

// Creates POST request
app.post('/api/notes', (req, res) => {

    // Declares a response object to send back to client
    let response;

    // Checks to make sure there is content in req.body, req.body.title, and req.body.text
    if(req.body && req.body.title && req.body.text) {
        response = {
            status: 'success',
            data: req.body
        }
        // Adds new note to the db.json which contains a string of note objects
        notes.push(req.body);
    }

    // Lets client know tht the POST request was received
    res.json(`${req.method} request received`);

    // Logs the request in the terminal
    console.info(`${req.method} request received`);
    // Logs the body of the requestto the console which is an object containing the note title and text
    console.log(req.body);
});

// Creates routes for any end point not found to send the index.html file
app.get('*', (req, res) => 
    res.sendFile(path.join(__dirname, 'public/index.html'))
);

// Use listen() method for the server to listen on the specified port
app.listen(PORT, () =>
    console.log(`Express server listening at http://localhost:${PORT}`)
);