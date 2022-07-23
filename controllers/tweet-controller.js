// getTweets (進到個人首頁渲染出所有資料)/ 
const tweetcontroller = {
  getMainpage: (req, res) => {
    return res.render('index')
  }
}

module.exports = tweetcontroller
