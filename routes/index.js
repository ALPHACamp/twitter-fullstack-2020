const tweetController = require('../controllers/tweetController.js')
module.exports = app => {

 //如果使用者訪問首頁，就導向 /main 的頁面
 app.get('/', (req, res) => res.redirect('/main'))

 //在 /main 底下則交給 restController.gettweets 來處理
 app.get('/main', tweetController.getTweets)
}