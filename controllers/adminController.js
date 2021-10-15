const db = require('../models')
const Op = db.Sequelize.Op
const User = db.User
const Tweet = db.Tweet
const Like = db.Like
const Reply = db.Reply
const sequelize = db.sequelize

const adminController = {
  signinPage: (req, res) => {
    return res.status(200).render('adminSigninForm', { layout: 'form' })
  },

  signin: (req, res) => {
    return res.redirect('/admin/tweets')
  },

  getTweets: async (req, res) => {
    try {
      const adminTweets = await Tweet.findAll({
        raw: true,
        nest: true,
        plain: false,
        attributes: ['id', 'description', 'createdAt'],
        include: [{ model: User, as: 'user', attributes: ['id', 'avatar', 'name', 'account'] }],
        order: [['createdAt', 'DESC']]
      })
      return res.render('adminPage', { layout: 'mainAdmin', adminTweets, to: 'adminTweet' })
    }
    catch (error) {
      console.log(error)
      req.flash('error_messages', '操作失敗')
      return res.redirect('back')
    }
  },

  getUsers: async (req, res) => {
    try {
      const adminUsersData = await User.findAll({
        raw: true, 
        nest: true,
        plain: false,
        where: { 
          [Op.or]: [
            { role: 'user' },
            { role: null },
          ]
        },
        attributes: [
          'id', 'name', 'account', 'avatar', 'cover',
          [sequelize.literal('(SELECT COUNT(*) FROM `tweets` WHERE tweets.UserId = User.id)'), 'tweetsCount'],
          [sequelize.literal('(SELECT COUNT(*) FROM `likes` WHERE likes.UserId = User.id)'), 'likesCount'],
          [sequelize.literal('(SELECT COUNT(*) FROM `followships` WHERE followships.followerId = User.id)'), 'followingsCount'],
          [sequelize.literal('(SELECT COUNT(*) FROM `followships` WHERE followships.followingId = User.id)'), 'followersCount'],
        ],
        order: [
          [sequelize.literal('tweetsCount'), 'DESC'],
          ['id', 'ASC']
        ],
      })

      return res.render('adminPage', { layout: 'mainAdmin', adminUsersData, to: 'adminUser' })
    } catch (error) {
      console.log(error)
      req.flash('error_messages', '操作失敗')
      return res.redirect('back')
    }
  },

  deleteTweet: async (req, res) => {
    try {
      const tweetId = Number(req.params.id)
      const tweet = await Tweet.findByPk(tweetId)
      if (tweet) {
        await Tweet.destroy({ where: { id: { [Op.eq]: tweetId } } })
        await Like.destroy({ where: { TweetId: { [Op.eq]: tweetId } } })
        await Reply.destroy({ where: { TweetId: { [Op.eq]: tweetId } } })
        return res.redirect('back')
      }
      req.flash('error_messages', '查無此筆資料')
      return res.redirect('back')
    }
    catch (error) {
      console.log(error)
      req.flash('error_messages', '操作失敗')
      return res.redirect('back')
    }
  }
}

module.exports = adminController