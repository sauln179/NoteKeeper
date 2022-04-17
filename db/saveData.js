// Dependecncies
const util = require('util');
const fs = require('fs');

//To create and keep track of ids of saved notes.
const { v4: uuidv4 } = require('uuid');

//Fs to read and write to file
const readNote = util.promisify(fs.readFile);
const writeNote = util.promisify(fs.writeFile);
//Creates a main Save class
class Save {
    write(note) {
        return writeNote('db/db.json', JSON.stringify(note));
    }
    
    //Reads what is in the database,
    read() {
        return readNote('db/db.json', 'utf8');
    }
    //Retrieves based on what it ended up reading within db.json
    retrieveNotes() {
        return this.read().then(notes => {
            let parsedNotes;
            try {
                parsedNotes = [].concat(JSON.parse(notes));
            } catch (err) {
                parsedNotes = [];
            }
            return parsedNotes;
        });
    }

    addNote(note) {
        const { title, text } = note;
        if (!title || !text) {
            throw new Error('Both title and text can not be blank');
        }
        // Creates the id
        const newNote = { title, text, id: uuidv4() };

        // Retrieve Notes, add the new note, update notes
        return this.retrieveNotes()
            .then(notes => [...notes, newNote])
            .then(updatedNotes => this.write(updatedNotes))
            .then(() => newNote);
    }

}

module.exports = new Save();
