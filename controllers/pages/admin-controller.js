const { QueryTypes } = require('sequelize')
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
  getTweets: (req, res, next) => {
    return sequelize.query('SELECT `Users`.`account`, `Users`.`name`, `Users`.`avatar`, substring(`Tweets`.`description`, 1, 50) AS `description`, `Tweets`.`createdAt`, `Tweets`.`id` FROM Tweets LEFT JOIN Users on`Users`.`id` = `Tweets`.`userId` ORDER BY `Tweets`.`createdAt` DESC',
      { type: QueryTypes.SELECT }
    )
      .then(dbResult => {
        const tweets = dbResult.map(tweet => tweet)
        res.render('admin/tweets', { tweets })
      })
      .catch(next)
  },
  deleteTweet: (req, res, next) => {
    const tweetId = req.params.tweetId
    return sequelize.query('DELETE FROM Tweets WHERE `Tweets`.`id` = :tweetId;', {
      type: QueryTypes.DELETE,
      replacements: { tweetId }
    })
      .then(() => {
        req.flash('error_messages', '成功刪除一筆推文')
        res.redirect('back')
      })
      .catch(next)
  },
  getUsers: async (req, res, next) => {
    try {
      const users = await sequelize.query(
      // Likes關聯Tweets取得每篇tweet的like數量並將table命名為tweetLikes，Users關聯Tweets和tweetLikes取得每位user的tweet總和，以及所有tweet的like總和
        'SELECT `Users`.*, COUNT(`Tweets`.`id`) AS `tweetCounts`, SUM(`tweetLikes`.`likes`) AS `likeCounts`, (SELECT COUNT(`followerId`) FROM `Followships` WHERE `followingId` = `Users`.`id`) AS `followerCounts`, (SELECT COUNT(`followingId`) FROM `Followships` WHERE `followerId` = `Users`.`id`) AS `followingCounts` FROM `Users` LEFT JOIN `Tweets` ON `Tweets`.`UserId` = `Users`.`id` LEFT JOIN (SELECT `Tweets`.`id` AS `TweetId`, COUNT(`Likes`.`id`) AS `likes` FROM `Likes` LEFT JOIN `Tweets` ON `Likes`.`TweetId` = `Tweets`.`id` GROUP BY `Tweets`.`id`) AS `tweetLikes` ON `tweetLikes`.`TweetId` = `Tweets`.`id` WHERE `Users`.`role` != "admin" GROUP BY `Users`.`id` ORDER BY `tweetCounts` DESC;',
        { type: QueryTypes.SELECT }
      )
      return res.render('admin/users', { users })
    } catch (err) {
      next(err)
    }
  }
}

module.exports = adminConroller
