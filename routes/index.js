const twitController = require('../controllers/twitController.js')


module.exports = app => {

  app.get('/', (req, res) => res.redirect('/twitters'))

  app.get('/twitters', twitController.getTwitters)


}