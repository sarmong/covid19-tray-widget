const { BrowserWindow } = require('electron')
const path = require('path')


const chooseCountryWindow = () => {

    const mainWindow = new BrowserWindow({
        width: 900,
        height: 900,
        webPreferences: {
            nodeIntegration: true
        }
    });

    mainWindow.loadFile(path.join(__dirname, 'chooseCountryWindow.html'));

    //mainWindow.webContents.openDevTools();


};

module.exports = chooseCountryWindow