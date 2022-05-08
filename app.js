const express = require('express')
const helpers = require('./_helpers');

const app = express()
const port = 3000

// use helpers.getUser(req) to replace req.user
// use helpers.ensureAuthenticated(req) to replace req.isAuthenticated()

app.get('/', (req, res) => {
  console.log('1234')
  res.send('Hello World!')
  console.log('hdkauwdu')
}

)
app.listen(port, () => console.log(`Example app listening on port ${port}!`))

module.exports = app
