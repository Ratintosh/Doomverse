const { BrowserWindow, app } = require('electron');
const path = require('path');
const url = require('url');

const library = require("../library/library.js")
const runner = require("../runner/runner.js")
const config = require("../config/config.js")

// Function to create the main window
function createMainWindow() {
    let mainWindow = new BrowserWindow({
        width: 1024,
        height: 768,
        show: false, //prevents flickering
        webPreferences: {
            nodeIntegration: true,
            contextIsolation: false,
            enableRemoteModule: true
        },
        frame: false, // this is a requirement for transparent windows it seems
        show: true,
        blur: true,
        blurType: "blurbehind",
        blurGnomeSigma: 100,
        blurCornerRadius: 20,
        vibrancy: "fullscreen-ui",
        frame: false,
        transparent: true
    })
    mainWindow.loadURL(url.format({
        pathname: path.join(app.getAppPath(), 'src/static/index.html'),
        protocol: 'file:',
        slashes: true
    }))

    mainWindow.once('ready-to-show', () => {
        mainWindow.show()
        library.updateLibrary(mainWindow);
        cfg = config.getConfig();
        config.configWindow(cfg);
    })

    mainWindow.on('closed', function () {
        mainWindow = null
    })

    return mainWindow;
}

// Function to create the preferences window
function createConfigWindow(cfg) {
    let configWindow = new BrowserWindow({
        width: 500,
        height: 768,
        show: false,
        webPreferences: {
            nodeIntegration: true,
            contextIsolation: false,
            enableRemoteModule: true,
        },
        frame: false,
        transparent: true,
        vibrancy: "fullscreen-ui",
    });

    configWindow.loadURL(url.format({
        pathname: path.join(app.getAppPath(), 'src/static/configure.html'), // or use app.getAppPath()
        protocol: 'file:',
        slashes: true,
    }));

    configWindow.once('ready-to-show', () => {
        configWindow.show();
    });

    configWindow.on('closed', () => {
        configWindow = null;
    });

    return configWindow;
}

function createWizardWindow() {
    wizard = new BrowserWindow({
        width: 720,
        height: 480,
        show: false, //prevents flickering
        webPreferences: {
            nodeIntegration: true,
            contextIsolation: false,
            enableRemoteModule: true
        },
        frame: false, // this is a requirement for transparent windows it seems
        show: true,
        blur: true,
        blurType: "blurbehind",
        blurGnomeSigma: 100,
        blurCornerRadius: 20,
        vibrancy: "fullscreen-ui",
        frame: false,
        transparent: true
    })
    wizard.loadURL(url.format({
        pathname: path.join(app.getAppPath(), 'src/static/addgame.html'),
        protocol: 'file:',
        slashes: true
    }))
    wizard.once('ready-to-show', () => {
        wizard.show()
    })
    wizard.on('closed', function () {
        mainWindow = null
    })
}

module.exports = {
    createMainWindow,
    createConfigWindow,
    createWizardWindow,
};
