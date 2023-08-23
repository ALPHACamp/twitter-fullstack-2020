const bcrypt = require('bcryptjs')
const { Tweet, User, Followship } = require("../models");

const userController = {
  signupPage: (req, res) => {
    res.render('signup')
  },
  signup: (req, res, next) => {
    const { account, name, email, password, checkPassword } = req.body
    const emailPromise = User.findOne({ where: { email } })
    const accountPromise = User.findOne({ where: { account } })
    let mailMsg = ''
    let accountMsg = ''
    let passwordMsg = ''

    return Promise.all([emailPromise, accountPromise])
      .then(([mailUser, accountUser]) => {
        if (mailUser) {
          mailMsg = '此信箱已被使用'
        }
        if (accountUser) {
          accountMsg = '此帳號已被使用'
        }
        if (password !== checkPassword) {
          passwordMsg = '密碼與確認密碼不相符'
        }
        if (mailMsg || accountMsg || passwordMsg) {
          return res.render('signup', { passwordMsg, mailMsg, accountMsg, account, name, email })
        } else {
          bcrypt.hash(password, 10)
            .then(hashedPassword => {
              return User.create({
                account,
                name,
                email,
                password: hashedPassword
              })
            })
            .then(() => res.redirect('/signin'))
        }
      })
  },
  signinPage: (req, res) => {
    res.render('signin')
  },
  sigin: (req, res) => {
    // req.flash('success_messages', '成功登入!')
    res.redirect('/tweets')
  },
  logout: (req, res) => {
    // req.flash('success_messages', '登出成功!')
    req.logout()
    res.redirect('/signin')
  },
  postFollow: async (req, res, next) => {
    try {
      const { followingUserId } = req.params;
      const currentUserId = req.user.id;
      const user = await User.findByPk(followingUserId);
      const followship = await Followship.findOne({
        where: { followerId: currentUserId, followingId: followingUserId },
      });
      if (!user) throw new Error("User didn't exist");
      if (followship) throw new Error("You are already following this user!");
      await Followship.create({
        followerId: currentUserId,
        followingId: followingUserId,
      });
      res.redirect("back");
    } catch (err) {
      console.log(err)
    }
  },
};

module.exports = userController;
