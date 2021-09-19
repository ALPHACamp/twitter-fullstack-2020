const tweetController = require('../controllers/tweetController.js')
const adminController = require('../controllers/adminController.js')

module.exports = app => {
  app.get("/", (req, res) => res.render("index"));
  app.get("/posts", (req, res) => res.render("posts"));
  app.get("/users/1/main", (req, res) => res.render("personalpage"));
  
  // tweetController
  app.get('/tweets', tweetController.getRestaurants)


  app.get('/admin', (req, res) => res.redirect('/admin/tweets'))
  app.get('/admin/tweets', adminController.getTweets)
  app.delete('/admin/tweets/:id', adminController.deleteAdminTweets)
  app.get('/admin/users', adminController.getUsers)
}
