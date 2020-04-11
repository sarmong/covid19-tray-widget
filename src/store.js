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

module.exports = store