// Import express.js
const express = require('express');

// Import path package from node to resolve paths of files on the server
const path = require('path');

// Import fs module to work with the file system 
const fs = require('fs');

// Helper method for generating unique ids, uuid is now a function that can be called to generate an id
const uuid = require('./helpers/uuid');

// Initialize an instance of express.js
const app = express();

// Adds middleware to parse incoming request data with json
app.use(express.json());

// Adds middleware to parse with urlencoded data in urlencoded format
app.use(express.urlencoded({ extended: true }));

// Sepcifies the PORT on which the server will run, Checks PORT number in an environment variable using process.env.PORT
const PORT = process.env.PORT || 3001;

// Static middleware for the public folder
app.use(express.static('public'));

// Creates route to the path /notes to serve the notes.html
app.get('/notes', (req, res) =>
    res.sendFile(path.join(__dirname, 'public/notes.html')),
);

// Creates API route to read the db.json file and return all saved notes as JSON
app.get('/api/notes', (req, res) => {
    // Stores the parsed db.json file in the parsedDb const
    const parsedDb = JSON.parse(fs.readFileSync("db/db.json", "utf-8"));
    // Responds to the client with the parsedDb in JSON
    // This allows the newly added note to render on the browser after clicking save
    res.json(parsedDb);
});

// Creates POST request to add a note
app.post('/api/notes', (req, res) => {

    // Logs that a POST request was received to the console 
    console.info(`${req.method} request was received to add a note`);
    
    // Destructuring assignment for the items in req.body
    const { title, text } = req.body;
    console.log(req.body);

    // Checks to make sure there is a title and text in the req.body object 
    if(title && text) {
        // Declares variable for the new note object to be saved
        const newNote = {
            title,
            text,
            id: uuid()
        };

        // Obtain existing notes by reading data from reviews.json file, this returns a string
        fs.readFile('./db/db.json', 'utf-8', (err, data) => {
            // Error handling
            if (err) {
                console.error(err);
            } else {
                // Convert data string into JSON object by parsing with JSON.parse()
                const parsedNotes = JSON.parse(data);

                // Pushes new note object to the parsedNotes array containing all notes objects
                parsedNotes.push(newNote);

                // Writes the new db.json file containing the added note
                fs.writeFile(
                    './db/db.json',
                    // Turns the JSON parsed notes into a string to write to db.json file
                    JSON.stringify(parsedNotes, null, 4),
                    // Write error handling
                    (writeErr) =>
                        writeErr
                            ? console.error(writeErr)
                            : console.info('Successfully updated notes')
                );
                // Responds with the parsedNotes as JSON to update the notes displayed in the browser
                res.json(parsedNotes);
            };
        });
    } else {
        // Responds in JSON with a status code of 500
        res.status(500).json('Error in posting note');
    }
});

// Creates DELETE request by using :id as a placeholder for the specific id of the note that was selected
app.delete('/api/notes/:id', (req, res) => {
    // Reads the db.json file and stores the existing notes string as a noteData variable
    let noteData = fs.readFileSync('./db/db.json', 'utf-8');
    // Parses the note data string into json and stores it in parsedData
    const parsedData = JSON.parse(noteData);
    // filters through the parsedData notes json with a function that returns a false statement
    const newNotes = parsedData.filter((note) => {
        // Returns a false statement so the note can be deleted
        return note.id !== req.params.id;
    });
    // Writes the new list of note objects to the db.json file which now doesn't include the deleted note
    fs.writeFileSync('./db/db.json', JSON.stringify(newNotes, null, 4));
    res.json('Note deleted!');
    console.info('Note deleted!');
});

// Creates routes for any end point not found to send the index.html file
app.get('*', (req, res) => 
    res.sendFile(path.join(__dirname, 'public/index.html'))
);

// Use listen() method for the server to listen on the specified port
app.listen(PORT, () =>
    console.log(`Express server listening at http://localhost:${PORT}`)
);