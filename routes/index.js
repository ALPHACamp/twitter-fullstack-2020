const tweetController = require('../controllers/tweetController.js')

module.exports = app =>{
  app.get('/',(req,res)=>res.redirect('tweet'))
  app.get('/tweet',tweetController.getTweets)
}