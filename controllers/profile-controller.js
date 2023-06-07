const profileController = {
  getUserTweets: (req, res) => {
    // 取得loginUser(使用helpers), userId
    // 取對應的user資料
    // 判斷user是否存在
    // 判斷user是否為本人
    res.render('users/profile')
  },
  getUserFollows: (req, res) => {
    res.render('users/follow')
  },
  editUser: (req, res) => {
    res.render('users/edit')
  }
}

module.exports = profileController
