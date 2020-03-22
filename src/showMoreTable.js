const { BrowserWindow } = require('electron')
const path = require('path')


const showMoreTable = () => {

    const mainWindow = new BrowserWindow({
        width: 900,
        height: 900,
        webPreferences: {
            nodeIntegration: true
        }
    });

    mainWindow.loadFile(path.join(__dirname, 'showMoreTable.html'));

    //mainWindow.webContents.openDevTools();


};

module.exports = showMoreTable