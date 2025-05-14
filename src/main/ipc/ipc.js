const {ipcMain, app, BrowserWindow, dialog} = require('electron')
const path = require('path');
const library = require('../library/library'); 
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
    window.webContents.send('clearLibrary');
    library.addToLibrary(arg, window);
})

ipcMain.on('closeConfigWindow', (event) => {
    // Get the BrowserWindow that sent this message
    const senderWindow = BrowserWindow.fromWebContents(event.sender);
    
    if (senderWindow) {
        senderWindow.close();
    }
});