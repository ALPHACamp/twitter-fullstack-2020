const db = require('../models')
const User = db.User
const Tweet = db.Tweet
const Like = db.Like
const Reply = db.Reply
const helpers = require('../_helpers')

const adminController = {
  signInPage: (req, res) => {
    try {
      return res.render('admin/signin', { status: (200) })
    } catch (err) {
      console.log('adminsignInPage err')
      req.flash('error_messages', '後台頁面讀取失敗！')
      res.status(302)
      return res.redirect('back')
    }
  },
  signIn: (req, res) => {
    try {
      if (helpers.getUser(req).role == 'admin') {
      req.flash('success_messages', '成功登入後台！')
      res.redirect('/admin/tweets')
    } else {
      req.flash('error_messages', '帳號或密碼錯誤')
      res.redirect('/admin/signin')
    }
    }catch(err){
      console.log('adminsignIn err')
      req.flash('error_messages', '後台登入失敗！')
      res.status(302)
      return res.redirect('back')
    }
    

  },
  logOut: (req, res) => {
    try{
      req.flash('success_messages', '成功登出！')
    req.logOut()
    res.redirect('/admin/signin')
    }catch(err){
      console.log('adminlogOut err')
      req.flash('error_messages', '後台登出失敗！')
      res.status(302)
      return res.redirect('back')
    }
    
  },
  getTweets: async (req, res) => {
    try {
      let tweets = await Tweet.findAll({
        raw: true,
        nest: true,
        attributes: ['id', 'description', 'createdAt'],
        order: [['createdAt', 'DESC']],
        include: {
          model: User,
          attributes: ['id', 'name', 'account', 'avatar'],
          where: { role: 0 }
        }
      })
      tweets = tweets.map(data => ({
        ...data,
        description:
          data.description.length < 50
            ? data.description
            : data.description.substring(0, 50) + '...'
      }))
      return res.render('admin/tweets', { tweets })

    } catch (err) {
      console.log('admingetTweets err')
      req.flash('error_messages', '獲取推文失敗！')
      res.status(302)
      return res.redirect('back')
    }
  },

  deleteTweet: async (req, res) => {
    try {
      const id = req.params.tweetId

      await Tweet.destroy({ where: { id } })
      // likes, replies 都要刪 才能防止ghost data
      await Like.destroy({ where: { TweetId: id } })
      await Reply.destroy({ where: { TweetId: id } })
      res.status(200)
      req.flash('success_messages', '刪除推文成功！')
      return res.redirect('back')
    } catch (err) {
      console.log('deleteTweet err')
      req.flash('error_messages', '刪除推文失敗！')
      res.status(302)
      return res.redirect('back')
    }
  },
  getUsers: async (req, res) => {
    try {
      let users = await User.findAll({
        where: { role: 0 },
        attributes: ['name', 'account', 'avatar', 'cover'],
        include: [
          { model: User, as: 'Followers' },
          { model: User, as: 'Followings' },
          { model: Tweet, as: 'LikedTweets' },
          Tweet
        ]
      })
      users = users.map(r => ({
        ...r.dataValues,
        followerCount: r.Followers.length,
        followingCount: r.Followings.length,
        tweetCount: r.Tweets.length,
        likedCount: r.LikedTweets.length
      }))
      users.sort((a, b) => b.tweetCount - a.tweetCount)

      return res.render('admin/users', { status: (200), users })
    } catch (err) {
      console.log('admingetUsers err')
      req.flash('error_messages', '讀取使用者失敗！')
      res.status(302)
      return res.redirect('back')
    }
  }
}

module.exports = adminController
