const tweetController = {
  getTweets:(req,res,next)=>{ // 進入推文清單
    res.render('tweets')
  },
  getTweet:(req,res,next)=>{ // 登入使用者頁面顯示個人推文清單
    res.render('users')
  }
}

module.exports = tweetController