const {app, BrowserWindow} = require('electron');
const log = require('electron-log');
const {autoUpdater} = require("electron-updater");
const url = require('url');
const path = require('path');

autoUpdater.logger = log;
autoUpdater.logger.transports.file.level = 'info';
log.info('App starting...');

let win;

function sendStatusToWindow(text) {
    log.info(text);
    win.webContents.send('message', text);
}

function createDefaultWindow() {
    win = new BrowserWindow();

    win.on('closed', () => {
        win = null;
    });

    win.loadURL(url.format({
        pathname: path.join(__dirname, 'index.html'),
        protocol: 'file:',
        slashes: true
    }));

    return win;
}

autoUpdater.on('checking-for-update', () => {
    sendStatusToWindow('Checking for update...');
});

autoUpdater.on('update-available', () => {
    sendStatusToWindow('Update available.');
});

autoUpdater.on('update-not-available', () => {
    sendStatusToWindow('Update not available.');
});

autoUpdater.on('error', () => {
    sendStatusToWindow('Error in auto-updater.');
});

autoUpdater.on('download-progress', () => {
    sendStatusToWindow('Download progress...');
});

autoUpdater.on('update-downloaded', () => {
    sendStatusToWindow('Update downloaded; will install in 5 seconds');
});

app.on('ready', function () {
    createDefaultWindow();
});

app.on('window-all-closed', () => {
    app.quit();
});

autoUpdater.on('update-downloaded', () => {
    setTimeout(function () {
        autoUpdater.quitAndInstall();
    }, 5000)
});

app.on('ready', function () {
    autoUpdater.checkForUpdates();
});