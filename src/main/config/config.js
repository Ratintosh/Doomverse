const fs = require('fs');
const { ipcMain, app, BrowserWindow, dialog } = require('electron');
const path = require('path');
const url = require('url');
const os = require('os');

const configPath = path.join(app.getPath('userData'), 'config.json'); // Using dynamic path

let configData = {}; // Store config data

// Load config data from config.json
function getConfig() {
    try {
        const rawData = fs.readFileSync(configPath, 'utf-8');
        configData = JSON.parse(rawData);
    } catch (error) {
        console.error('Error reading config.json:', error);
        configData = {}; // Return empty object on error
    }
    return configData;
}

// Write config data to config.json
async function writeConfig(usrCfg) {
    try {
        await fs.promises.writeFile(configPath, JSON.stringify(usrCfg, null, 4), 'utf-8');
        console.log('Data written to config.json successfully!');
    } catch (err) {
        console.error('Error writing to config.json:', err);
    }
}

// Create config window
function configWindow(cfg) {
    let window = new BrowserWindow({
        width: 500,
        height: 768,
        show: false, // Prevent flickering
        webPreferences: {
            nodeIntegration: true,
            contextIsolation: false,
            enableRemoteModule: true,
        },
        frame: false,
        transparent: true,
        vibrancy: "fullscreen-ui",
    });

    window.loadURL(url.format({
        pathname: path.join(app.getAppPath(), 'src/static/configure.html'),
        protocol: 'file:',
        slashes: true
    }));

    window.once('ready-to-show', () => {
        window.show();
    });

    window.on('closed', () => {
        window = null;
    });

    ipcMain.on('requestConfig', () => {
        window.webContents.send('config', cfg);
    });
}

// Validate the config (placeholder logic, can be customized)
function validateConfig() {
    // Example: Check if required fields are present in the config
    if (!configData.someField) {
        console.log('Config validation failed.');
        return false;
    }
    return true;
}


// Exporting functions using module.exports
module.exports = {
    getConfig,
    writeConfig,
    configWindow,
    validateConfig
};
