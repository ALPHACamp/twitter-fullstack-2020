const userController = {
  signUpPage: (req, res) => {
    return res.render('signup')
  },
  signUp: (req, res) => {
    const { name, email, password, passwordCheck } = req.body
    if (password !== passwordCheck) {
      req.flash('warning_msg', '兩次密碼輸入不同！')
      return res.render('signup', { name, email, password, passwordCheck })
    } else {
      User.findOne({ where: { email } })
        .then(user => {
          if (user) {
            req.flash('warning_msg', '此信箱已註冊！')
            return res.render('signup', { name, email, password, passwordCheck })
          } else {
            User.create({
              name,
              email,
              password: bcrypt.hashSync(password, bcrypt.genSaltSync(10), null)
            })
              .then(user => {
                req.flash('success_msg', '註冊成功，請登入！')
                return res.redirect('/signin')
              })
          }
        })
        .catch(err => res.send(err))
    }
  }
}

module.exports = userController