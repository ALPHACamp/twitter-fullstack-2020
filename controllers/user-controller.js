const userController = {
  signUpPage: (req, res) => {
      return res.render('signup')
  },
  signInPage: (req, res) => {
    return res.render('signin')
  },
  getUser: (req,res) => { //取得個人資料頁面
    return res.render('users')
  }
}

module.exports = userController