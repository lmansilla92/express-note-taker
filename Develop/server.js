// TODO: Fix bug where new notes don't display until server is turned off.

// Import express.js
const express = require('express');

// Import path package from node to resolve paths of files on the server
const path = require('path');

// Import fs module to work with the file system 
const fs = require('fs');

// Helper method for generating unique ids
const uuid = require('./helpers/uuid');

// Initialize an instance of express.js
const app = express();

// Adds middleware to parse data to json
app.use(express.json());

// Adds middleware to parse with urlencoded data in urlencoded format
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
app.get('/api/notes', (req, res) => {
    // Stores the parsed db.json file in the parsedDb const
    const parsedDb = JSON.parse(fs.readFileSync("db/db.json", "utf-8"));
    // Responds to the client with the parsedDb in JSON
    res.json(parsedDb);
});

// Creates POST request
app.post('/api/notes', (req, res) => {

    // Logs that a POST request was received to the console 
    console.info(`${req.method} request was received to add a note`);

    // // Declares a response object to send back to client
    // let response;
    
    // Destructuring assignment for the items in req.body
    const { title, text } = req.body;
    console.log(req.body);

    // Checks to make sure there is content in req.body, req.body.title, and req.body.text
    if(title && text) {
        // Declares variable for the new note object to be saved
        const newNote = {
            title,
            text,
            note_id: uuid()
        };

        // Obtain existing notes by reading data from reviews.json file
        fs.readFile('./db/db.json', 'utf-8', (err, data) => {
            if (err) {
                console.error(err);
            } else {
                // Convert data string into JSON object by parsing with JSON.parse()
                const parsedNotes = JSON.parse(data);

                // Pushes new note to the parsedNotes array containing all notes
                parsedNotes.push(newNote);

                fs.writeFile(
                    './db/db.json',
                    JSON.stringify(parsedNotes, null, 4),
                    (writeErr) =>
                        writeErr
                            ? console.error(writeErr)
                            : console.info('Successfully updated notes')
                );
                res.json(parsedNotes);
            };
        });
    } else {
        res.status(500).json('Error in posting note');
    }
});
    //     const response = {
    //         status: 'success',
    //         body: newNote
    //     };

    //     console.log(response);
    //     res.status(201).json(response);
    // } else {
    //     res.status(500).json('Error in posting note');
    // }
        // // Adds new note to the db.json which contains a string of note objects
        // notes.push(req.body);


//     // Lets client know tht the POST request was received
//     res.json(`${req.method} request received`);

//     // Logs the request in the terminal
//     console.info(`${req.method} request received`);
//     // Logs the body of the requestto the console which is an object containing the note title and text
//     console.log(req.body);
// }    

// Creates routes for any end point not found to send the index.html file
app.get('*', (req, res) => 
    res.sendFile(path.join(__dirname, 'public/index.html'))
);

// Use listen() method for the server to listen on the specified port
app.listen(PORT, () =>
    console.log(`Express server listening at http://localhost:${PORT}`)
);