const moment = require('moment');
const bcrypt = require('bcryptjs');
const imgur = require('imgur-node-api');
const fs = require('fs');
//const IMGUR_CLIENT_ID = process.env.IMGUR_CLIENT_ID
const helpers = require('../_helpers');
const db = require('../models');
const user = require('../models/user');
const User = db.User;
const Tweet = db.Tweet;
const Reply = db.Reply;
const Like = db.Like;
const Followship = db.Followship
const tweetsSidebar = 'tweetsSidebar'


const userController = {
  signUpPage: (req, res) => {
    return res.render('signup');
  },

  signUp: async (req, res) => {
    const { account, name, email, password, passwordCheck } = req.body;
    const errors = [];
    if (password !== passwordCheck) {
      errors.push({ message: '密碼與確認密碼不相符' });
    }
    if (errors.length > 0) {
      return res.render('signup', {
        account,
        name,
        email,
        password,
        passwordCheck,
        errors,
      });
    }
    try {
      const userAccount = await User.findOne({ where: { account } });
      const userEmail = await User.findOne({ where: { email } });
      if (userAccount) {
        req.flash('error_msg', '帳號已被註冊過了');
        return res.redirect('/signup');
      }
      if (userEmail) {
        req.flash('error_msg', 'Email已被註冊過了');
        return res.redirect('/signup');
      }
      await User.create({
        account: account,
        name: name,
        email: email,
        password: bcrypt.hashSync(password, bcrypt.genSaltSync(10), null),
        role: 'user'
      });
      req.flash('success_msg', '帳號註冊成功');
      return res.redirect('/signin');
    } catch (error) {
      console.log(error);
    }
  },

  signInPage: (req, res) => {
    if (req.isAuthenticated()) {
      return res.redirect('/tweets')
    }
    res.render('signin')
  },

  signIn: (req, res) => {
    User.findOne({ where: { email: req.body.email } })
      .then((user) => {
        if (!user.dataValues.role.match('admin')) {
          req.flash('success_msg', '登入成功');
          res.redirect('/tweets');
        } else {
          req.flash('error_msg', '此帳號不是普通用戶')
          res.redirect('/signin')
        }
      })
  },

  logOut: (req, res) => {
    req.flash('success_msg', '登出成功');
    req.logout();
    res.redirect('/signin');
  },

  getUser: async (req, res) => {
    try {
      const user = await User.findByPk(req.params.id, {
        attributes: ['id', 'account', 'name', 'avatar', 'introduction', 'cover', 'role'],
        include: [
          Tweet,
          { model: Tweet, include: [{ model: Like, attributes: ['id'] }] },
          { model: Tweet, include: [Reply] },
          { model: User, as: 'Followers' },
          { model: User, as: 'Followings' },
        ]
      })
      const userData = {
        id: user.id,
        account: user.account,
        name: user.name,
        avatar: user.avatar,
        introduction: user.introduction,
        cover: user.cover,
        role: user.role,
        tweetsCount: user.Tweets.length,
        followersCount: user.Followers.length,
        followingsCount: user.Followings.length,
      }
      const tweetsData = await user.Tweets.map((data) => ({
        userId: data.UserId,
        tweetId: data.id,
        description: data.description.substring(0, 100),
        elapsedTime: moment(data.createdAt, 'YYYYMMDD').fromNow(),
        likesCount: data.Likes.length,
        repliesCount: data.Replies.length,
        isLike: req.user.Likes.map(d => d.id).includes(data.id)
      }))
      return res.render('user', {
        user: userData,
        tweets: tweetsData,
        tweetsSidebar
      })
    } catch (err) {
      console.log(err)
    }
  },

  getUserEdit: async (req, res) => {
    const userId = helpers.getUser(req).id
    if (userId !== Number(req.params.id)) {
      req.flash('error_msg', '抱歉！你只能編輯自己的個人資訊')
      return res.redirect(`/users/${req.params.id}`)
    }
    const user = await User.findByPk(userId, { raw: true })
    return res.render('edit', { user: user })
  },

  putUserEdit: async (req, res) => {
    const { name, introduction, avatar, cover } = req.body
    const errors = []
    if (!name || !introduction) {
      errors.push({ message: '名稱或自我介紹欄位，不可空白' })
    }
    if (name.length > 50) {
      errors.push({ message: '名稱必須在50字符以內' })
    }
    if (introduction.length > 160) {
      errors.push({ message: '自我介紹，必須在160字符以內' })
    }
    if (errors.length > 0) {
      return res.render('edit', { name, introduction, avatar, cover, errors })
    }
    const images = {}
    const { files } = req
    const uploadImg = path => {
      return new Promise((resolve, reject) => {
        imgur.upload(path, (err, img) => {
          if (err) {
            return reject(err)
          }
          resolve(img)
        })
      })
    }
    const userId = helpers.getUser(req).id
    if (files) {
      const IMGUR_CLIENT_ID = process.env.IMGUR_CLIENT_ID.toString()
      imgur.setClientID(IMGUR_CLIENT_ID)
      for (const key in files) {
        images[key] = await uploadImg(files[key][0].path)
      }
    }
    const user = await User.findByPk(userId)
    await user.update({
      name: name,
      introduction: introduction,
      cover: images.cover ? images.cover.data.link : user.cover,
      avatar: images.avatar ? images.avatar.data.link : user.avatar
    })
    req.flash('success_msg', '您的個人資訊已更新')
    return res.redirect(`/users/${user.id}`)
  },

  getUserLikes: async (req, res) => {
    try {
      const user = await User.findByPk(req.params.id, {
        include: [
          {
            model: Like,
            order: [['createdAt', 'DESC']],
            include: [{
              model: Tweet,
              include: [Like, Reply, User]
            }]
          },
          { model: User, as: 'Followers' },
          { model: User, as: 'Followings' },
        ]
      })
      const userData = {
        id: user.id,
        account: user.account,
        name: user.name,
        avatar: user.avatar,
        introduction: user.introduction,
        cover: user.cover,
        role: user.role,
        likeTweetsCount: user.Likes.length,
        followersCount: user.Followers.length,
        followingsCount: user.Followings.length,
      }
      const likeTweetsData = await user.Likes.map((data) => ({
        id: data.Tweet.User.id,
        avatar: data.Tweet.User.avatar,
        name: data.Tweet.User.name,
        account: data.Tweet.User.account,
        description: data.Tweet.description.substring(0, 100),
        elapsedTime: moment(data.Tweet.createdAt, 'YYYYMMDD').fromNow(),
        likesCount: data.Tweet.Likes.length,
        repliesCount: data.Tweet.Replies.length
      }))
      return res.render('likes', {
        user: userData,
        likeTweets: likeTweetsData,
        tweetsSidebar
      })
    } catch (err) {
      console.log(err)
    }
  },

  getRepliesAndTweets: async (req, res) => {
    try {
      const user = await User.findByPk(req.params.id, {
        include: [{
          model: Reply,
          order: [['createdAt'], ['DESC']],
          include: [{
            model: Tweet,
            include: [Like, Reply, User]
          }],
        },
        { model: User, as: 'Followers' },
        { model: User, as: 'Followings' },]
      })
      const userData = {
        id: user.id,
        account: user.account,
        name: user.name,
        avatar: user.avatar,
        introduction: user.introduction,
        cover: user.cover,
        role: user.role,
        RepliesTweetsCount: user.Replies.length,
        followersCount: user.Followers.length,
        followingsCount: user.Followings.length,
      }
      const repliesTweetsData = await user.Replies.map((data) => ({
        id: data.Tweet.User.id,
        avatar: data.Tweet.User.avatar,
        name: data.Tweet.User.name,
        account: data.Tweet.User.account,
        description: data.Tweet.description.substring(0, 100),
        elapsedTime: moment(data.Tweet.createdAt, 'YYYYMMDD').fromNow(),
        likesCount: data.Tweet.Likes.length,
        repliesCount: data.Tweet.Replies.length
      }))
      return res.render('repliesList', {
        user: userData,
        repliesTweets: repliesTweetsData,
        tweetsSidebar
      })
    } catch (err) {

    }
  },

  getUserSetting: async (req, res) => {
    const userId = helpers.getUser(req).id
    const user = await User.findByPk(userId, {
      attributes: ['id', 'account', 'email', 'name', 'role'],
    })
    return res.render('setting', { user: user.toJSON() })
  },

  putUserSetting: async (req, res) => {
    const { account, name, email, password, passwordCheck } = req.body
    const errors = []
    // Make sure all columns are correct
    if (!account || !name || !email || !password || !passwordCheck) {
      errors.push({ message: '所有欄位皆為必填' })
    }
    if (password !== passwordCheck) {
      errors.push({ message: '密碼與確認密碼必須相同' })
    }
    if (name.length > 50) {
      errors.push({ message: '名稱必須在50字元以內' })
    }
    if (account.length > 50) {
      errors.push({ message: '帳號必須在50字元以內' })
    }
    if (errors.length > 0) {
      return res.render('setting', {
        account, name, email, password, errors
      })
    }
    const userId = helpers.getUser(req).id
    const user = await User.findByPk(userId)
    const userAccount = await User.findOne({ where: { account } })
    const userEmail = await User.findOne({ where: { email } })
    // Make sure the email & account have not been used by others
    if (userAccount && userAccount.dataValues.account !== user.account) {
      req.flash('error_msg', '帳號已有人使用了')
      return res.redirect('back')
    }
    if (userEmail && userEmail.dataValues.email !== user.email) {
      req.flash('error_msg', 'Email已有人使用了')
      return res.redirect('back')
    }
    // Update user account information
    await user.update({
      account: account,
      name: name,
      email: email,
      password: bcrypt.hashSync(
        password,
        bcrypt.genSaltSync(10),
        null
      )
    })
    req.flash('success_msg', '您的帳號資訊更新成功')
    return res.redirect(`/users/${user.id}/setting`)
  },

  getfollowers: (req, res) => {
    const followersUser = []
    req.user.Followers.forEach((user) => {
      const item = {
        name: user.name,
        account: user.account,
        avatar: user.avatar,
        introduction: user.introduction,
        isFollowed: req.user.Followings.some(d => d.Followship.followerId === user.Followship.followingId)
      }
      followersUser.push(item)
    })
    res.render('follower', { followersUser, tweetsSidebar })
  },

  getfollowing: (req, res) => {
    const following = 'following'
    const followingUser = []
    req.user.Followings.forEach((user) => {
      const item = {
        name: user.name,
        account: user.account,
        avatar: user.avatar,
        introduction: user.introduction,
        isFollowed: req.user.Followings.some(d => d.Followship.followerId === user.Followship.followerId)
      }
      followingUser.push(item)
    })
    res.render('follower', { followingUser, tweetsSidebar, following })
  },

  getSuggestFollower: (req, res, next) => {
    return User.findAll({
      where: { role: 'user' },
      include: [{ model: User, as: 'Followers' }]
    })
      .then(users => {
        users = users.map((user) => (
          {
            ...user.dataValues,
            isFollowed: user.Followers.some(d => d.id === req.user.id),
            FollowersCount: user.Followers.length
          }))
        users = users.sort((a, b) => b.FollowersCount - a.FollowersCount).slice(0, 10)
        res.locals.users = users;
        return next()
      })
      .catch(err => console.log(err))
  },

  addFollowing: (req, res) => {
    if (req.user.id === parseInt(req.params.id)) {
      req.flash('error_messages', '無法追蹤自己')
      return res.redirect('back')
    };
    return Followship.create({
      followerId: req.user.id,
      followingId: req.params.id
    })
      .then((followship) => {
        return res.redirect('back')
      })
  },

  removeFollowing: (req, res) => {
    return Followship.findOne({
      where: {
        followerId: req.user.id,
        followingId: req.params.id
      }
    })
      .then((followship) => {
        followship.destroy()
          .then((followship) => {
            return res.redirect('back')
          })
      })
  },
  addlike: (req, res) => {
    return Like.create({
      UserId: req.user.id,
      TweetId: req.params.id
    })
      .then(() => {
        return res.redirect('back')
      })
  },
  removelike: (req, res) => {
    return Like.findOne({
      where: {
        UserId: req.user.id,
        TweetId: req.params.id
      }
    })
      .then((like) => {
        like.destroy()
          .then(() => {
            return res.redirect('back')
          })
      })
  }
};

module.exports = userController;
