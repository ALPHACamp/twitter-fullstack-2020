const { Op } = require('sequelize');
const bcrypt = require('bcryptjs');
const db = require('../models');

const {
  Tweet, User, Reply, Like, Followship,
} = db;

const usersController = {
  registerPage: (req, res) => res.render('regist'),
  register    : (req, res) => {
    const {
      name, email, account, password, passwordCheck,
    } = req.body;
    if (!name || !email || !account || !password || !passwordCheck) {
      req.flash('error_messages', '所有欄位都是必填');
      return res.redirect('/regist');
    }
    if (passwordCheck !== password) {
      req.flash('error_messages', '兩次密碼輸入不一致');
      return res.redirect('/regist');
    }
    return User.findOne({
      where: { [Op.or]: [{ email }, { account }] },
    }).then((user) => {
      if (user) {
        if (user.account === account) {
          req.flash('error_messages', '帳號已經有人用了');
        }
        if (user.email === email) {
          req.flash('error_messages', '此 Email 已存在');
        }
        return res.redirect('/regist');
      }
      return User.create({
        email   : req.body.email,
        password: bcrypt.hashSync(req.body.password, bcrypt.genSaltSync(10), null),
        name    : req.body.name,
        account : req.body.account,
      }).then(() => {
        req.flash('success_messages', '成功註冊帳號');
        res.redirect('/login');
      })
      .catch((error) => console.log('register error', error));
    });
  },
  loginPage: (req, res) => {
    res.render('login');
  },

  login: (req, res) => {
    req.flash('success_messages', '登入成功');
    res.redirect('/');
  },

  logout: (req, res) => {
    req.flash('success_messages', '登出成功');
    req.logout();
    res.redirect('/login');
  },
};
module.exports = usersController;
