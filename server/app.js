const express = require('express')
const app = express()

const axios = require('axios')


if(process.env.DEBUG == true) {
  app.get('/debug', (req, res) => res.send('This server is in debug mode.'))
}

app.get('/', (req, res) => res.send('Hello Server!'))
app.get('/datafile', (req, res) => {
  axios.get('http://api:8000/datafile') // notice the URL host here -- b/c of docker we can reference the container name instead of localhost
    .then(response => {
      console.log(response.data)
      res.send(response.data)
    })
})

// LISTENING ON 8001
app.listen(8001, () => console.log('Server ready'))
