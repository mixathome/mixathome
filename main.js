const {app, BrowserWindow, globalShortcut} = require('electron');
const {autoUpdater} = require("electron-updater");
const url = require('url');
const path = require('path');
const log = require('electron-log');

autoUpdater.logger = log;
autoUpdater.logger.transports.file.level = 'info';
log.info('App starting...');

let 
    win,
    interval;

function createDefaultWindow() {
    win = new BrowserWindow({
        kiosk: true,
        width: 1280,
        height: 800
    });

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

app.on('ready', function () {
    createDefaultWindow();
});

app.on('window-all-closed', () => {
    app.quit();
});

autoUpdater.on('update-available', () => {
    clearInterval(interval);
});

autoUpdater.on('update-downloaded', () => {
    autoUpdater.quitAndInstall();
});

app.on('ready', function () {
    globalShortcut.register('Alt+F4', () => {
        app.quit();
    });

    interval = setInterval(() => {
        autoUpdater.checkForUpdates();
    }, 60000);
});

app.on('will-quit', () => {
    globalShortcut.unregisterAll()
});