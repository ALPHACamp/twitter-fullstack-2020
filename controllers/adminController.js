const db = require('../models')
const { Tweet, User, Like } = db

const adminController = {
  getTweets: async (req, res) => { 
    try {
      let tweets = await Tweet.findAll({ 
        raw: true, 
        nest: true, 
        order: [[ 'createdAt', 'DESC' ]], 
        include: [ { model: User } ] 
      })

      tweets = tweets.map(tweet => ({
        ...tweet,
        description: tweet.description.slice(0, 50)
      }))
      
      return res.render('admintweets', { tweets })
    } catch (err) { console.error(err) }
  },

  deleteTweet: async (req, res) => {
    try {
      await Tweet.destroy({ where: { id: req.params.id }  })
      return res.redirect('/admin/tweets')
    } catch (err) { console.error(err) }
  },

  adminUsers: async (req, res) => {
    try { 
      let users =  await User.findAll({
        include: [
          { model: Tweet, include: [Like] },
          { model: User, as: 'followings' },
          { model: User, as: 'Followers' },
        ],
        order: [[ Tweet, 'createdAt', 'ASC' ]],
      })

      users = users.map(user => 
        ({
          ...user.dataValues,
          tweetsCount: user.Tweets.length,
          likesCount: adminController.sumLikes(
            user.Tweets.map(tweet => tweet.Likes.length)
          ), // 有寫工具function adminController.sumLikes(arr) 計算加總 
          followingsCount: user.followings.length,
          followersCount: user.Followers.length
        })
      ).sort((a, b) => b.tweetsCount - a.tweetsCount) // 根據tweet數排序
      

      return res.render('adminusers', { users })
      // return res.json(users)
    } catch (err) { console.error(err) }
  },

  sumLikes: (arr) => {
    let likes = 0
    arr.forEach(i => likes += i)
    return likes
  }
}

module.exports = adminController