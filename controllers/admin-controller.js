// admin頁面各種 signin/ getuser/ gettweet/ deletetweet/ logout

const adminController = {
  getAdminTweets: (req, res) => {
    return res.render('admin/tweets')
  }
}

module.exports = adminController
