//TODO:
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
const { initLibrary } = require('./library/library.js');

// IPC handlers
require("./ipc/ipc");

app.once('ready', () => {
    /*
    1. Initialization & Setup

        Configuration Loading: Read user settings (e.g., last used IWAD, preferred source port, mod paths).
        Filesystem Checks: Verify that required directories exist (e.g., mods folder, config files).
        Log System Setup: Start a logging system to capture errors, warnings, and debugging info.

    2. Game Data & Engine Detection

        Locate IWADs: Scan for available IWAD files (e.g., doom.wad, doom2.wad, tnt.wad, plutonia.wad).
        Detect Source Ports: Check for installed Doom engines (e.g., GZDoom, ZDoom, Crispy Doom).
        Verify Integrity: (Optional) Hash IWADs to confirm they are unmodified.

    3. Mod Scanning & Indexing

        Load Installed Mods: Scan mod directories for WAD, PK3, and DEH files.
        Parse Metadata: Extract mod names, versions, authors, and dependencies.
        Resolve Dependencies: Identify conflicts and missing dependencies.

    4. User Authentication (If Applicable)

        Check for Online Features: If your loader supports mod downloads or updates, authenticate the user with a service like ModDB or Doomworld.

    5. UI Preparation

        Load UI Assets: Ensure fonts, themes, and icons are ready.
        Check for Updates: If your mod loader has an update system, notify the user about new versions.
        Show a Splash Screen: Optionally, display a loading animation while performing background tasks.
    */
        initLibrary()
        createConfigWindow();
        createMainWindow();
});