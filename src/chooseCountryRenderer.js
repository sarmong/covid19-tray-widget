const covid = require('novelcovid')
const { ipcRenderer } = require('electron')

const form = document.getElementById("countrySelector")

const search = document.getElementById("search")
search.oninput = function(e) {
    const filter = e.target.value.toLowerCase()
    const radios = form.getElementsByClassName("radio-container")

    for (let i=0; i < radios.length; i++) {
        if (radios[i].getElementsByTagName("input")[0].value.toLowerCase().indexOf(filter) === -1) {
            radios[i].style.display = "none"
        } else {
            radios[i].style.display = "block"
        }
    }
}

function createRadio(name) {
    const container = document.createElement("div")
    container.classList.add("radio-container")
    container.setAttribute("id", name + "-container")

    const input = document.createElement("input")
    input.setAttribute("type", "radio")
    input.setAttribute("id", name)
    input.setAttribute("name", "country")
    input.setAttribute("value", name)

    input.addEventListener('change', (e) => {
        ipcRenderer.send('country-updated', e.target.value)
    })

    container.appendChild(input)

    const label = document.createElement("label")
    label.setAttribute("for", name)
    label.textContent = name
    container.appendChild(label)

    form.appendChild(container)
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