const fs = require('fs').promises

const express = require('express')
const app = express()

// This value is brought in from environment variables
if(process.env.DEBUG == true) {
  app.get('/debug', (req, res) => res.send('This api is in debug mode.'))
}


app.get('/', (req, res) => res.send('Hello Api!'))
app.get('/datafile', (req, res) => {
  // This just reads the contents of the file and sends it as a JSON response
  const data = fs.readFile('/data/non-ephemeral.txt', {encoding: 'utf-8'}).then(data => {
    console.log("Data read from file: " + data)
    res.send({
      'fileContents': data.toString()
    })
  })
})
app.get('/create-file', (req, res) => {
  // This just writes a hello world file to the file system
  console.log("Writing to a file...")
  fs.writeFile('/data/hello-world.json', JSON.stringify({'hello': 'world'}, null, 2))
    .then(data => {
      res.send("Successfully wrote to file!")
    })
    .catch(err => {
      res.send(err)
    })
})

// LISTENING ON /8000
app.listen(8000, () => console.log('Api ready'))
