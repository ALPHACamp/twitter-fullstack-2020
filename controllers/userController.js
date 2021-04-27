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
  }

};

module.exports = userController;
