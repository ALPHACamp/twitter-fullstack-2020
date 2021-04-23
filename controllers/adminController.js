const { Tweet } = require('../models')
const { getUser } = require('../_helpers')

const showFiftyString = (str) => {
  if (str.length < 50) {
    return str
  }
  return str.substring(0, 50) + '.....'
}

const adminController = {
  getTweets: (req, res) => {
    Tweet.findAll(
      {
        order: [['createdAt', 'DESC']]
      }
    ).then((tweets) => {
      tweets = tweets.map((d, i) => ({
        ...d.dataValues,
        description: showFiftyString(d.description)
      }))

      const pageTitle = '推文清單'
      const isAdminPage = true

      res.render('admin/tweets', { tweets, pageTitle, isAdminPage })
    })
      .catch(e => {
        console.warn(e)
      })
  },

  // 管理者 登入頁面
  signInPage: (req, res) => {
    return res.render('admin/signin')
  },

  // 管理者 登入
  signIn: (req, res) => {
    if(getUser(req).isAdmin) {
      req.flash('success_messages', '成功登入管理者權限')
      return res.redirect('/admin/tweets')
    } else {
      req.flash('warning_msg', '請使用管理者權限')
      return res.redirect('/admin/signIn')
    }
  }
}

module.exports = adminController
