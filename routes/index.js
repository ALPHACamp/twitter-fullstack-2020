const tweetController = require('../controllers/tweetController.js')

module.exports = app =>{
  app.get('/',(req,res)=>res.redirect('register'))
  app.get('/register',tweetController.getTweets)
}