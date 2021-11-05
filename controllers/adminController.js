const { Tweet, User } = require('../models')
const { getUser } = require('../_helpers')

const showFiftyString = (str) => {
  const splitStr = str.split(' ')
  if (splitStr.length < 50) {
    return str
  }
  const newStr = splitStr.slice(0, 50)
  return newStr.join(' ') + '.....'
}

const adminController = {

  // 管理員 推文清單
  getTweets: async (req, res) => {
    try {
      const tweets = await Tweet.findAll({
        raw: true,
        nest: true,
        include: [User],
        order: [['createdAt', 'DESC']]
      })
      const tweet = tweets.map((data, i) => ({
        ...data,
        description: showFiftyString(data.description)
      })) 
      return res.render('admin/tweets', { tweet })
    } catch (e) {
      console.log(e)
    }
  },

  // 管理員 刪除推文
  deleteTweets: (req, res) => {
    const tweet_id = req.params.id

    Tweet.findOne({ where: { id: Number(tweet_id) } })
      .then(tweet => {
        return tweet.destroy()
      }).then(() => {
        res.redirect('back')
      })
      .catch(e => console.warn(e))
  },

  // 管理者 使用者列表
  getUsers: async (req, res) => {
    try {
      const users = await User.findAll({
        include:[
          Tweet,
          { model: Tweet, as: 'LikedTweets' },
          { model: User, as: 'Followings' },
          { model: User, as: 'Followers' },
        ]
      })
      const data = users.map(item => ({
        ...item.dataValues,
        LikesCount: item.dataValues.LikedTweets.length,
        TweetsCount: item.dataValues.Tweets.length,
        followersCount: item.dataValues.Followers.length,
        followingsCount: item.dataValues.Followings.length,
      }))
      const newData = data.filter(a => a.account !== 'root')
      const user = newData.sort((a, b) => b.TweetsCount - a.TweetsCount)
      return res.render('admin/users', { user })
    } catch (e) {
      console.log(e)
    }
  },
  
  // 管理者 登入頁面
  signInPage: (req, res) => {
    return res.render('admin/signin')
  },

  // 管理者 登入
  signIn: (req, res) => {
    if (getUser(req).isAdmin) {
      req.flash('success_messages', '成功登入管理者權限')
      return res.redirect('/admin/tweets')
    } else {
      req.flash('warning_msg', '請使用管理者權限')
      return res.redirect('/admin/signIn')
    }
  }
}

module.exports = adminController
