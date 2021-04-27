const bcrypt = require('bcryptjs');
const imgur = require('imgur-node-api');
const fs = require('fs');
const IMGUR_CLIENT_ID = process.env.IMGUR_CLIENT_ID
const helpers = require('../_helpers');
const db = require('../models');
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
        role:'user'
      });
      req.flash('success_msg', '帳號註冊成功');
      return res.redirect('/signin');
    } catch (error) {
      console.log(error);
    }
  },

  signInPage: (req, res) => {
    return res.render('signin');
  },

  signIn: (req, res) => {
    User.findOne({ where:{ account:req.body.account}})
      .then((user)=>{
        if (!user.dataValues.role.match('admin')){
          req.flash('success_msg', '登入成功');
          res.redirect('/tweets');
        }else{
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
        attributes: ['id', 'account', 'name', 'avatar', 'introduction', 'cover'],
        include: [
          { model: User, as: 'Followers' },
          { model: User, as: 'Followings' }
        ]
      })
      const tweets = await Tweet.findAll({
        raw: true,
        nest: true,
        include: [
          { model: Reply, include: [User] },
          Like
        ],
        where: { UserId: req.params.id }
      })
      const tweetsData = await tweets.map(data => ({
        description: data.description.substring(0, 100),
        createdAt: data.createdAt,
        repliesCount: data.Replies.length,
        likesConut: data.Likes.length,
      }))
      return res.render('user', {
        user: user.toJSON(),
        tweetsData: tweetsData
      })
    } catch (err) {
      console.log(err)
    }
  },

  getUserEdit: async (req, res) => {
    const userId = helpers.getUser(req).id
    if (userId !== Number(req.params.id)) {
      req.flash('error_msg', '抱歉！你只能編輯自己的個人資訊')
      return res.redirect(`/user/${req.params.id}`)
    }
    const user = await User.findByPk(userId, { raw: true })
    return res.render('edit', { user: user })
  },

  putUserEdit: (req, res) => {

  },

  getUserSetting: async (req, res) => {
    const userId = helpers.getUser(req).id
    const user = await User.findByPk(userId, {
      attributes: ['id', 'account', 'email', 'name'],
    })
    return res.render('setting', { user: user.toJSON() })
  },
  getfollowers:(req,res)=>{
    res.render('follower',{tweetsSidebar})
  },
  getSuggestFollower:(req, res, next) => {
  return User.findAll({
    where: { role: 'user' },
    include: [{ model: User, as: 'Followers' }]
  })
    .then(users => {
      users = users.map((user)=> (
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
};

module.exports = userController;
