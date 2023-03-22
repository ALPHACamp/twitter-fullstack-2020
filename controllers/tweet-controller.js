const tweetController = {
  getTweets:(req,res,next)=>{
    res.render('tweets')
  },
  getTweet:(req,res,next)=>{
    res.render('users')
  }
}

module.exports = tweetController