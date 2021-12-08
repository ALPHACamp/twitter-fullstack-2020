const helpers = require('../_helpers')
const userController = require('./userController')
const tweetController = require('./tweetController')

const pageController = {
  getSignUp: (req, res) => {
    return res.render('signup')
  },

  getSignIn: (req, res) => {
    const isBackend = req.url.includes('admin')
    return res.render('signin', { isBackend })
  },

  getIndex: async (req, res) => {
    try {
      if (helpers.getUser(req).role === 'admin') {
        req.flash('error_messages', '你無法瀏覽此頁面')
        return res.redirect('/admin/tweets')
      }

      const [tweets, pops] = await Promise.all([
        tweetController.getTweets(req, res),
        userController.getPopular(req, res)
      ])

      return res.render('user', {
        tweets,
        pops,
        partial: 'tweets'
      })
    } catch (err) {
      console.error(err)
    }
  },

  getSettings: async (req, res) => {
    try {
      if (helpers.getUser(req).id !== Number(req.params.userId)) {
        req.flash('error_messages', '你無法瀏覽此頁面')
        return res.redirect('/tweets')
      }

      return res.render('user', {
        partial: 'profileSettings'
      })
    } catch (err) {
      console.error(err)
    }
  },

  getUserTweets: async (req, res) => {
    try {
      const [user, tweets, pops] = await Promise.all([
        userController.getUserProfile(req, res),
        userController.getUserTweets(req, res),
        userController.getPopular(req, res)
      ])
      return res.render('user', {
        user,
        tweets,
        pops,
        partial: 'profileTweets'
      })
    } catch (err) {
      console.error(err)
    }
  },

  getUserReplies: async (req, res) => {
    try {
      const [user, replies, pops] = await Promise.all([
        userController.getUserProfile(req, res),
        userController.getUserReplies(req, res),
        userController.getPopular(req, res)
      ])
      return res.render('user', {
        user,
        replies,
        pops,
        partial: 'profileReplies'
      })
    } catch (err) {
      console.error(err)
    }
  },

  getUserLikes: async (req, res) => {
    try {
      const [user, tweets, pops] = await Promise.all([
        userController.getUserProfile(req, res),
        userController.getUserLikes(req, res),
        userController.getPopular(req, res)
      ])
      return res.render('user', {
        user,
        tweets,
        pops,
        partial: 'profileLikes'
      })
    } catch (err) {
      console.error(err)
    }
  },

  getUserFollowers: async (req, res) => {
    try {
      const [user, followers] = await Promise.all([
        userController.getUserProfile(req, res),
        userController.getUserFollowers(req, res)
      ])
      return res.json({
        user,
        followers,
        partial: 'profileFollower'
      })
    } catch (err) {
      console.error(err)
    }
  },

  getUserFollowings: async (req, res) => {
    try {
      const [user, followings] = await Promise.all([
        userController.getUserProfile(req, res),
        userController.getUserFollowings(req, res)
      ])
      return res.render('user', {
        user,
        followings,
        partial: 'profileFollowing'
      })
    } catch (err) {
      console.error(err)
    }
  }
}

module.exports = pageController
