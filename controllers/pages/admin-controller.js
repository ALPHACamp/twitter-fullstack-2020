const { Op } = require('sequelize')
const { User, Tweet, Like, sequelize } = require('../../models')

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
  getTweets: (req, res, next) => {
    return sequelize.query('SELECT `Users`.`account`, `Users`.`name`, `Users`.`avatar`, substring(`Tweets`.`description`, 1, 50) AS `description`, `Tweets`.`createdAt`, `Tweets`.`id` FROM Tweets LEFT JOIN Users on`Users`.`id` = `Tweets`.`userId` ORDER BY `Tweets`.`createdAt` DESC'
    )
      .then(dbResult => {
        const tweets = dbResult[0].map(tweet => tweet)
        res.render('admin/tweets', { tweets })
      })
      .catch(next)
  },
  deleteTweet: (req, res, next) => {
    return sequelize.query('DELETE FROM Tweets WHERE `Tweets`.`id` = ' + req.params.tweetId + ';')
      .then(() => {
        req.flash('error_messages', '成功刪除一筆推文')
        res.redirect('back')
      })
      .catch(next)
  },
  getUsers: (req, res, next) => {
    return User.findAll({
      attributes: {
        include: [
          [sequelize.literal('(SELECT COUNT(`followerId`) FROM `Followships` WHERE `followingId` = `User`.`id`)'), 'followerCounts'],
          [sequelize.literal('(SELECT COUNT(`followingId`) FROM `Followships` WHERE `followerId` = `User`.`id`)'), 'followingCounts']
        ]
      },
      include: [{ model: Tweet, attributes: ['id'], include: [Like] }],
      where: {
        role: {
          [Op.not]: 'admin'
        }
      }
    })
      .then(users => {
        users = users.map(u => ({
          ...u.toJSON(),
          tweetCounts: u.Tweets.length,
          likeCounts: u.Tweets.reduce((acc, cur) => {
            return acc + cur.Likes.length
          }, 0)
        }))
          .sort((a, b) => b.tweetCounts - a.tweetCounts)

        res.render('admin/users', { users })
      })
      .catch(err => next(err))
  }
}

module.exports = adminConroller
