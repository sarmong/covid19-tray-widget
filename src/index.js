const { app, Menu, Tray } = require('electron')
const path = require('path')
const covid = require('novelcovid')

const Store = require('electron-store');

const defaults = {
  country: 'Global',
  countryData: {},
  config: {
    cases: true,
    todayCases: true,
    deaths: true,
    mortalityRate: false,
    todayDeaths: false,
    recovered: false,
    active: false,
    critical: false,
  }
}
const store = new Store({defaults});

const { ipcMain } = require('electron')

const chooseCountryWindow = require('./chooseCountryWindow')
const showMoreTable = require('./showMoreTable')


// Handle creating/removing shortcuts on Windows when installing/uninstalling.
if (require('electron-squirrel-startup')) { // eslint-disable-line global-require
  app.quit();
}

let tray = null

function onCheckbox(menuItem) {
  store.set("config." + menuItem.sublabel, menuItem.checked)
  formatData()
}


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
    { type: 'separator' },
    { label: "Show Data",
      submenu: [
        { label: 'Total cases', sublabel: 'cases', type: "checkbox", checked: store.get('config.cases'), click: onCheckbox},
        { label: 'Today cases', sublabel: 'todayCases', type: "checkbox", checked: store.get('config.todayCases'), click: onCheckbox},
        { label: 'Total deaths', sublabel: 'deaths', type: "checkbox", checked: store.get('config.deaths'), click: onCheckbox},
        { label: 'Mortality Rate', sublabel: 'mortalityRate', type: "checkbox", checked: store.get('config.mortalityRate'), click: onCheckbox},
        { label: 'Today deaths', sublabel: 'todayDeaths', type: "checkbox", checked: store.get('config.todayDeaths'), click: onCheckbox},
        { label: 'Recovered', sublabel: 'recovered', type: "checkbox", checked: store.get('config.recovered'), click: onCheckbox},
        { label: 'Active', sublabel: 'active', type: "checkbox", checked: store.get('config.active'), click: onCheckbox},
        { label: 'Critical', sublabel: 'critical', type: "checkbox", checked: store.get('config.critical'), click: onCheckbox},
      ]},
    { label: 'Choose Country', click: () => chooseCountryWindow() },
    { label: 'Show More', click: () => showMoreTable()},
    { label: 'Quit', role: 'quit' }
  ])
  tray.setContextMenu(contextMenu)
}

function formatData() {
  let result = "";
  const data = store.get('countryData')
  const config = store.get('config')

  for (let prop in config) {
    if (config[prop] === true) {
      if (store.get('country') === 'Global') {
        switch (prop) {
          case 'cases':
            result += "🦠" + data.cases;
            break;
          case 'deaths':
            result += " 💀" + data.deaths;
            break;
          case 'mortalityRate':
            if (config.deaths === true) {
              result += "(" + (data.deaths/data.cases*100).toFixed(2) +  "%)";
              break;
            } else {
              result += " " + (data.deaths/data.cases*100).toFixed(2) + "%";
              break;
            }
          case 'recovered':
            result += " 😀" + data.recovered;
            break;
        }
      } else {
        switch (prop) {
          case 'cases':
            result += "🦠" + data.cases;
            break;
          case 'todayCases':
            if (config.cases === true) {
              result += "(" + data.todayCases + "🔼" + ")";
              break;
            } else {
              result += " " + data.todayCases + "🔼";
              break;
            }
          case 'deaths':
            result += " 💀" + data.deaths;
            break;
          case 'mortalityRate':
            if (config.deaths === true) {
              result += "(" + (data.deaths/data.cases*100).toFixed(2) +  "%)";
              break;
            } else {
              result += " " + (data.deaths/data.cases*100).toFixed(2) + "%";
              break;
            }
          case 'todayDeaths':
            if (config.deaths === true) {
              result += "(" + data.todayDeaths + "🔺" + ")";
              break;
            } else {
              result += " " + data.todayDeaths + "🔺";
              break;
            }
          case 'recovered':
            result += " 😀" + data.recovered;
            break;
          case 'active':
            result += " 😷" + data.active;
            break;
          case 'critical':
            result += " 🚑" + data.critical;
            break;
        }
      }
    }
  }
    tray.setTitle(result)
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

  if (country === 'Global') {
    const data = await covid.all()
    store.set('countryData', data)
  } else {
    const allCountries = await covid.countries()
    const data = allCountries.find(el => el.country === country)
    store.set('countryData', data)
  }

  formatData()
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