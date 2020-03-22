const { app, Menu, Tray } = require('electron')
const path = require('path')
const covid = require('novelcovid')

const Store = require('electron-store');
const store = new Store();


const { ipcMain } = require('electron')

const chooseCountryWindow = require('./chooseCountryWindow')


// Handle creating/removing shortcuts on Windows when installing/uninstalling.
if (require('electron-squirrel-startup')) { // eslint-disable-line global-require
  app.quit();
}

let tray = null

async function updateData () {
  const data = await covid.all()
  const date = new Date(data.updated)

  function pad(symb) {
    return String(symb).length == 1 ? '0' + symb : symb;
  }

  const string = pad(date.getHours()) + ":" + pad(date.getMinutes()) + " " + pad(date.getDate()) + "." + pad(date.getMonth()) + "." + date.getFullYear().toFixed().slice(2)

  const contextMenu = Menu.buildFromTemplate([
    { label: 'Update', click: () => updateData()},
    { label: 'Latest update: ' + string},
    { label: 'Choose Country', click: () => chooseCountryWindow() },
    { label: 'Quit', role: 'quit' }
  ])
  tray.setContextMenu(contextMenu)
}

async function fetchData(country) {
  if (!country) {
    if (!store.get('country')) {
      country = 'Global'
      store.set('country', country)
    } else {
      country = store.get('country')
    }
  } else {
    store.set('country', country)
  }

  let data
  if (country === 'Global') {
    data = await covid.all()
  } else {
    const allCountries = await covid.countries()
    data = allCountries.find(el => el.country === country)
  }

  function formatData(data) {
    const todayCases = data.todayCases !== undefined ? " (" + data.todayCases + "🔺" + ")" : "   "
    return "🦠" + data.cases + todayCases  + "💀" + data.deaths
  }

  tray.setTitle(formatData(data))
}

app.on('ready', () => {
  app.dock.hide()
  tray = new Tray(path.join(__dirname, 'icon.png'))
  updateData()
  setInterval(updateData, 10*60*1000)

  tray.setToolTip('Click to see the menu')


  ipcMain.on('country-updated', (event, arg) => {
    fetchData(arg)
  })

    fetchData()
})

app.on('window-all-closed', () => {
});