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

// IPC for file selection
ipcMain.on('chooseFile', (event, elementData) => {
    dialog.showOpenDialog({
        properties: ['openFile']
    }).then((data) => {
        const { section, value } = elementData;
        configData = getConfig(); // Reload config data
        configData[section][value] = data.filePaths;
        console.log(configData);
        writeConfig(configData).then(() => {
            event.sender.send('updateConfigWizard', configData);
        });
    });
});

// IPC for submitting config changes
ipcMain.on('submitConfigChanges', (event, data) => {
    console.log('Config changes:', data);
    writeConfig(data).then(() => {
        event.sender.send('configUpdated', data);
    });
});