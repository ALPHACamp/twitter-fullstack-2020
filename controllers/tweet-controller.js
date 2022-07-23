// getTweets (進到個人首頁渲染出所有資料)/ 
const tweetcontroller = {
  getTweets: (req, res) => {
    return res.render('tweets')
  }
}

module.exports = tweetcontroller
