const {ipcMain, app, BrowserWindow, dialog} = require('electron')
const path = require('path');
const library = require('../library/library'); 
const config = require('../config/config.js'); 
const runner = require('../runner/runner.js');  
const window = require('../window/window.js');

ipcMain.on('close-me', (evt, arg) => {
    app.quit()
})


ipcMain.on('launchGame', (evt, gameID) => {
    let data = library.getLibrary();
    let cmd = runner.generateCommand(data, gameID);
    runner.runCommand(cmd);
})

ipcMain.on('requestWizard', (evt, arg) => {
    window.createWizardWindow()
})


ipcMain.on('addGame', (evt, arg) => {
    const mainWindow = BrowserWindow.getAllWindows().find(win => win !== BrowserWindow.fromWebContents(evt.sender));
    
    if (mainWindow) {
        mainWindow.webContents.send('clearLibrary');
    }

    library.addToLibrary(arg, mainWindow);
})

ipcMain.on('closeConfigWindow', (event) => {
    // Get the BrowserWindow that sent this message
    const senderWindow = BrowserWindow.fromWebContents(event.sender);
    
    if (senderWindow) {
        senderWindow.close();
    }
});

ipcMain.on('getSourcePortOptions', (event) => {
    const sourcePortOptions = [];
    const sourcePorts = config.getConfig();
    for ( i in sourcePorts.sourceports) {
        const sourcePort = {
            value: i,
            text: i
        };
        sourcePortOptions.push(sourcePort);
    }
    event.sender.send('sourcePortOptions', sourcePortOptions);
});

ipcMain.on('getIWADOptions', (event) => {
    const iwadOptions = [];
    const cfg = config.getConfig();
    for ( i in cfg.iwads) {
        const iwad = {
            value: i,
            text: i
        };
        iwadOptions.push(iwad);
    }
    event.sender.send('IWADOptions', iwadOptions);
});