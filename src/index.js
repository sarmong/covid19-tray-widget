const { app, Menu, Tray } = require('electron')
const path = require('path')
const covid = require('novelcovid')

const { ipcMain } = require('electron')

const chooseCountryWindow = require('./chooseCountryWindow')


// Handle creating/removing shortcuts on Windows when installing/uninstalling.
if (require('electron-squirrel-startup')) { // eslint-disable-line global-require
  app.quit();
}


let tray = null
app.on('ready', () => {

  tray = new Tray(path.join(__dirname, 'virus.png'))
  const contextMenu = Menu.buildFromTemplate([
    { label: 'Choose Country', click: () => chooseCountryWindow() },
    { label: 'Quit', role: 'quit' }
  ])
  tray.setContextMenu(contextMenu)

  tray.setToolTip('Click to see the menu')


  function formatData(data) {
    const todayCases = data.todayCases ? " (" + data.todayCases + "🔺" + ")" : "   "
    return "🦠" + data.cases + todayCases  + "💀" + data.deaths
  }

  async function fetchData(country) {
    let data
    if (country === 'all') {
      data = await covid.all()
    } else {
      const allCountries = await covid.countries()
      data = allCountries.find(el => el.country === country)
    }
    tray.setTitle(formatData(data))
  }

  ipcMain.on('country-updated', (event, arg) => {
    fetchData(arg)
  })

  fetchData('all')
})

app.on('window-all-closed', () => {
});