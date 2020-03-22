const covid = require('novelcovid')
//const tablesort = require('tablesort')


const headers = ['Country', 'Total Cases', 'Today Cases', 'Total Deaths', 'Today Deaths', 'Recovered', 'Active', 'Critical', 'Cases per Million',]

const table = document.getElementById('data-table')

const thead = document.createElement('thead')
const theadRow = document.createElement('tr')

headers.forEach(header => {
    const th = document.createElement('th')
    th.textContent = header
    theadRow.appendChild(th)
})

thead.appendChild(theadRow)
table.appendChild(thead)

const tbody = document.createElement('tbody')

async function getData() {
    const data = await covid.countries()

    for (let i=0; i<data.length; i++) {
        const tr = document.createElement('tr')

        for (let prop in data[i]) {
            const td = document.createElement('td')
            td.textContent = data[i][prop]
            tr.appendChild(td)
        }

        tbody.appendChild(tr)
    }
    table.appendChild(tbody)
}

getData()

//tablesort(table)