import cheerio from 'cheerio'
import request from 'request'
import fs from 'fs'

const url = 'https://www.basketball-reference.com/leagues/NBA_2019_totals.html'
let col = []
let colFullName = {}
let result = []

request(url, (err, response, body) => {
  const $ = cheerio.load(body)
  // Find column's name
  $('table thead tr th').each((index, element) => {
    let node = $(element)
    col.push(node.text())
    colFullName[node.text()] = node.attr('aria-label')
  })
  // Fill every player in result
  $('table tbody').children().not('.thead').each((index, element) => {
    let node = $(element).children()
    let player = {}
    // Fill player's data
    node.each((index, element) => {
      player[col[index]] = $(element).text()
    })
    result.push(player)
  })
  // Save data as JSON
  fs.writeFileSync('data.json', JSON.stringify(result))
})
