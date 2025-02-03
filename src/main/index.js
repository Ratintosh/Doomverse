//TODO:
//
// -> Make the advanced tab of the wizard work
//
// -> Create config files (config.json & profiles.json) on first launch in a specific directory.
//    Likely ~/.doomverse/ for compatibility reasons.
//
// -> Alert the user upon first launch that no source ports were configured. 
//    Possibly add an "autodetect" button that'll search your computer for compatible source ports.
//    We can re-use the add game wizard CSS. We can also use this menu to detect iWADS and, if none are found,
//    prompt the user to add them manually. All of these should populate the config.json file.
//
// -> Change references to external files to include the new paths specified in config.json. 
// 
// -> Point references to internal files to the new ~/.doomverse/ location
//
// -> Fix the Grid CSS
//
// -> Make the side bar actually work.
//
// -> Do some last minute styling (specifically for the wizard)
//
// You got this!

const { app } = require('electron');
const { createMainWindow, createConfigWindow } = require('./window/window.js');

// IPC handlers
require("./ipc/ipc");

app.once('ready', () => {
    createConfigWindow();
    createMainWindow();
});