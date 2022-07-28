const { sequelize } = require('../../models')

const adminConroller = {
  getSignin: (req, res) => {
    res.render('admin/signin')
  },
  postSignin: (req, res) => {
    const ADMIN = 'admin'
    if (req.user.role === ADMIN) {
      req.flash('success_messages', '成功登入後台')
      return res.redirect('/admin/tweets')
    }
    req.logout()
    req.flash('error_messages', '帳號不存在')
    return res.redirect('/admin/signin')
  },
  getTweets: async (req, res) => {
    const dbResult = await sequelize.query('SELECT `Users`.`account`, `Users`.`name`, `Users`.`avatar`, substring(`Tweets`.`description`, 1, 50) AS `description`, `Tweets`.`createdAt`, `Tweets`.`id` FROM Tweets LEFT JOIN Users on`Users`.`id` = `Tweets`.`userId` ORDER BY `Tweets`.`createdAt` DESC'
    )
    const tweets = dbResult[0].map(tweet => tweet)
    return res.render('admin/tweets', { tweets })
  },
  deleteTweet: (req, res) => {
    return sequelize.query('DELETE FROM Tweets WHERE `Tweets`.`id` = ' + req.params.tweetId + ';')
      .then(() => {
        req.flash('error_messages', '成功刪除一筆推文')
        res.redirect('back')
      })
  }
}

module.exports = adminConroller
