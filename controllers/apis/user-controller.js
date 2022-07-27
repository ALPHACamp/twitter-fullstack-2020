const { User } = require('../../models')

const userConroller = {
  getUser: (req, res) => {
    res.json('apiEndPoint')
  }
}

module.exports = userConroller
