const { BrowserWindow } = require('electron')
const path = require('path')

const { ipcMain } = require('electron')

const store = require('./store')

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

    ipcMain.on('ready', (e) => {
        const currentCountry = store.get('country')
        e.reply('currentCountry', currentCountry)
    })

};

module.exports = chooseCountryWindow