

const tweetsController = {
  postTweet: (req, res, next) => {
    const {text} = req.body
    console.log(text)
    // 待資料庫建立好，於tweets新增一筆該user的tweet
    res.redirect('/tweets')
  }
}


module.exports = tweetsController