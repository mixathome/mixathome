const {app, BrowserWindow, globalShortcut, dialog} = require('electron');
const {autoUpdater} = require("electron-updater");
const url = require('url');
const path = require('path');
const express = require('express');
const log = require('electron-log');

autoUpdater.logger = log;
autoUpdater.logger.transports.file.level = 'info';
log.info('App starting...');

let 
    win,
    interval;
	
dialog.showErrorBox = function(title, content) {
    console.log(`${title}\n${content}`);
	
    clearInterval(interval);

    interval = setInterval(() => {
        autoUpdater.checkForUpdates();
    }, 60000);	
};

function createDefaultWindow() {
    win = new BrowserWindow({
        kiosk: true,
        width: 1280,
        height: 800
    });

    win.on('closed', () => {
        win = null;
    });

    const server = express();

    server.get('/', (req, res) => {
        res.sendFile(path.join(__dirname, 'index.html'));
    });

    server.use(express.static(path.join(__dirname, '.')));

    server.listen(8080);

    win.loadURL(url.format({
        pathname: 'localhost:8080',
        protocol: 'http:',
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
	
    clearInterval(interval);

    interval = setInterval(() => {
        autoUpdater.checkForUpdates();
    }, 60000);
});

app.on('will-quit', () => {
    globalShortcut.unregisterAll()
});
