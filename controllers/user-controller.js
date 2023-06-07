const userController = {
  signinPage: (req, res) => {
    res.render('signin')
  },
  signin: (req, res, next) => {
    console.log(req.user)
    req.flash('success_messages', '成功登入!')
    res.redirect('/tweets')
  }
}

module.exports = userController
