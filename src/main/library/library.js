const fs = require('fs');
const path = require('path');
const { app } = require('electron');

const profilesPath = path.join(app.getPath('userData'), 'profiles.json');

//init library
function initLibrary() {
    const userDataPath = app.getPath('userData');
    const libraryPath = path.join(userDataPath, 'library.json');

    try {
        if (!fs.existsSync(libraryPath)) {
            // Create library.json if it doesn't exist
            fs.writeFileSync(libraryPath, JSON.stringify({}, null, 2), 'utf-8');
            console.log('library.json created.');
        } else {
            // Read and store library.json content
            const data = fs.readFileSync(libraryPath, 'utf-8');
            libraryData = JSON.parse(data);
            console.log('library.json loaded:', libraryData);
        }
    } catch (error) {
        console.error('Error initializing library:', error);
    }
}


// Load profiles.json content
function getLibrary() {
    try {
        if (fs.existsSync(profilesPath)) {
            const rawdata = fs.readFileSync(profilesPath, 'utf-8');
            return JSON.parse(rawdata);
        }
    } catch (error) {
        console.error('Error reading profiles.json:', error);
    }
    return {}; // Return empty object if file doesn't exist
}

// Send game data to the window
function updateLibrary(window) {
    const data = getLibrary();
    for (const i in data) {
        const tmp = {
            name: data[i].metadata.name,
            author: data[i].metadata.author,
            year: data[i].metadata.year,
            cover: data[i].metadata.grid,
            id: i,
        };
        window.webContents.send('addgame', tmp);
    }
}

// Add a new game entry to profiles.json
function addToLibrary(gameData, window) {
    const uniqueID = Date.now();
    const currentLibrary = getLibrary();
    currentLibrary[uniqueID] = gameData;

    fs.writeFile(profilesPath, JSON.stringify(currentLibrary, null, 4), 'utf-8', (err) => {
        if (err) {
            console.error('Error writing to profiles.json:', err);
            return;
        }
        updateLibrary(window);
    });
}

// Export functions using module.exports
module.exports = {
    initLibrary,
    getLibrary,
    updateLibrary,
    addToLibrary,
};
