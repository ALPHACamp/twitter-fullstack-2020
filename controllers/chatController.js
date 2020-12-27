const helper = require('../_helpers')

const db = require('../models')
const User = db.User

// -----------------------------------------------------------------------------------

module.exports = {
  getPublicChat: async (req, res) => {

    return res.render('publicChats', {
      navPage: 'chatpublic',
    })
  }
}