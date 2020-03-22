const covid = require('novelcovid')
const { ipcRenderer } = require('electron')

const form = document.getElementById("countrySelector")

function createRadio(name) {
    const input = document.createElement("input")
    input.setAttribute("type", "radio")
    input.setAttribute("id", name)
    input.setAttribute("name", "country")
    input.setAttribute("value", name)

    input.addEventListener('change', (e) => {
        ipcRenderer.send('country-updated', e.target.value)
    })

    form.appendChild(input)

    const label = document.createElement("label")
    label.setAttribute("for", name)
    label.textContent = name
    form.appendChild(label)

    form.appendChild(document.createElement("br"))
}

async function fetchData() {
    const data = await covid.countries()

    const sortedData = data.sort((a,b) => {
        return (a.country < b.country) ? -1 : (a.country > b.country) ? 1 : 0;
    })

    createRadio("Global")
    for (let country of sortedData) {
        const countryName = country.country
        createRadio(countryName)
    }
}

fetchData()