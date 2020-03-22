const { app, Menu, Tray } = require('electron')
const path = require('path')
const covid = require('novelcovid');

// Handle creating/removing shortcuts on Windows when installing/uninstalling.
if (require('electron-squirrel-startup')) { // eslint-disable-line global-require
  app.quit();
}


let tray = null
app.on('ready', () => {

  tray = new Tray(path.join(__dirname, 'virus.png'))
  const contextMenu = Menu.buildFromTemplate([
      //{ label: 'Settings', click: () => settingsWindow() },
    { label: 'Quit', role: 'quit' }
  ])
  tray.setToolTip('This is my application')
  tray.setContextMenu(contextMenu)
  async function fetchData() {
    const data = await covid.all()
    tray.setTitle(data.cases.toFixed())
  }

  fetchData()
})

app.on('window-all-closed', () => {
});