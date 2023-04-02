const { User, Tweet, } = require('../../../models')
const bcrypt = require('bcryptjs') //載入 bcrypt
const dateFormatter = require('../../../helpers/dateFormatter')
const helpers = require('../../../_helpers')


const adminController = {
  adminSigninPage: (req, res) => {
    return res.render('admin/signin')
  },
  adminSignin: (req, res) => {
    req.flash('success_messages', '成功登入後台！')
    res.redirect('admin/tweets')
  },
  adminTweets: async (req, res) => {
    const tweets = await Tweet.findAll(
      {
        include: { model: User },
        order: [['createdAt', 'DESC']],
        raw: true,
        nest: true
      }
    )
    console.log(tweets)
    res.render('admin/tweets', { isTweets: true, tweets, layout: 'admin-main' })
  },
  adminUsers: (req, res) => {
    return res.render('admin/users', { isUsers: true, layout: 'admin-main' })
  }

}
module.exports = adminController