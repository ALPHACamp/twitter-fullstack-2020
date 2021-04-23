const db = require('../models')
const User = db.User
const Followship = db.Followship
const Tweet = db.Tweet
const bcrypt = require('bcryptjs')
const helpers = require('../_helpers')
const sequelize = require('sequelize')

const userController = {

  //getTopUsers
  getTopUsers: (req, res) => {
    return User.findAll({
      attributes: {
        include: [
          [
            sequelize.literal(`(
              SELECT COUNT(*)
              FROM followships AS followship
              WHERE
                followship.followingId = User.id
                )`),
            'followerCount',
          ],
        ]
      },
      include: { model: User, as: 'Followers' },
      order: [
        [sequelize.literal('followerCount'), 'DESC'],
        ['updatedAt', 'DESC']
      ],
      limit: 10,
    })
      .then(users => {
        users = users.map(u => ({
          ...u.dataValues,
          isFollowed: u.Followers.map(u => u.id).includes(helpers.getUser(req).id)
        }))
        res.send(users)
      })
      .catch(err => res.send(err))
  },
  signUpPage: (req, res) => {
    return res.render('signup')
  },
  signUp: (req, res) => {
    console.log(req.body)
    const { account, name, email, password, checkPassword } = req.body
    if (password !== checkPassword) {
      req.flash('warning_msg', '兩次密碼輸入不同！')
      return res.render('signup', { account, name, email, password })
    }
    User.create({
      account,
      name,
      email,
      password: bcrypt.hashSync(password, bcrypt.genSaltSync(10), null)
    })
      .then(user => {
        req.flash('success_msg', '註冊成功，請登入！')
        return res.redirect('/signin')
      })
      .catch(err => definitionErrHandler(err, req, res, { account, name, email, password })
      )
  },
  signInPage: (req, res) => {
    return res.render('signin')
  },
  signIn: (req, res) => {
    req.flash('success_msg', '登入成功！')
    res.redirect('/tweets')
  },
  logout: (req, res) => {
    req.flash('success_msg', '登出成功！')
    req.logout()
    res.redirect('/signin')
  },
  settingPage: (req, res) => {
    const loginUser = helpers.getUser(req)
    console.log(`id:${loginUser.id}`)
    User.findByPk(loginUser.id)
      .then(result => {
        return res.render('userSetting', { result: result.toJSON() })
      })
      .catch(err => res.send(err))
  },
  putSetting: (req, res) => {
    //trim input
    Object.keys(req.body).map(k => req.body[`${k}`] = req.body[`${k}`].trim())
    const { account, name, email, oldPassword, newPassword, checkNewPassword } = req.body
    const loginUser = helpers.getUser(req)
    //check no empty input
    if (!account || !name || !email) {
      req.flash('warning_msg', '請填入account、name、email');
      return res.redirect('back');
    }
    //require old password before changing it
    User.findByPk(loginUser.id)
      .then(user => {
        if (oldPassword && !bcrypt.compareSync(oldPassword, user.password)) {
          req.flash('warning_msg', 'Wrong Old Password!')
          return res.redirect('back')
        }
        //confirm new password input
        if (newPassword !== checkNewPassword) {
          req.flash('warning_msg', '兩次密碼輸入不同！')
          return res.redirect('back')
        }
        //update with password change
        if (oldPassword && newPassword) {
          user.update({
            account,
            name,
            email,
            password: bcrypt.hashSync(newPassword, bcrypt.genSaltSync(10))
          })
            .then(user => {
              req.flash('success_msg', 'Your setting was successfully updated')
              return res.redirect('/tweets')
            })
            .catch(err => definitionErrHandler(err, req, res,)
            )
        } else {
          //update without password change
          user.update({
            account,
            name,
            email
          })
            .then(user => {
              req.flash('success_msg', 'Your setting was successfully updated')
              return res.redirect('/tweets')
            })
            .catch(err => definitionErrHandler(err, req, res,)
            )
        }
      })
      .catch(err => {
        return res.send(err)
      })
  },
  followUser: (req, res) => {
    const followerId = Number(helpers.getUser(req).id)
    const followingId = Number(req.params.id)
    //不能追蹤自己
    if (followerId === followingId) {
      req.flash('warning_msg', 'You cannot be your own follower')
      return res.redirect('back')
    }
    //不能重複追蹤
    Followship.findOne({ where: { followerId, followingId } })
      .then(followship => {
        if (followship) {
          req.flash('warning_msg', 'You cannot follow the same person twice')
          return res.redirect('back')
        }
        return Followship.create({
          followerId,
          followingId
        })
          .then(() => res.redirect(`/users/${followingId}/tweets`))
          .catch(err => res.send(err))
      })
  },
  unfollowUser: (req, res) => {
    return Followship.findOne({
      where: {
        followerId: helpers.getUser(req).id,
        followeeId: req.params.userId
      }
    })
      .then(followship => {
        followship.destroy()
          .then(() => res.redirect('back'))
      })
      .catch(err => res.send(err))
  },
  getFollowers: (req, res) => {
    const loginUserId = helpers.getUser(req).id
    const paramUserId = req.params.id
    return Promise.all([
      User.findByPk(paramUserId, {
        include: [
          Tweet,
          { model: User, as: 'Followers' }
        ],
        order: [['Followers', 'createdAt', 'DESC']]
      }),
      User.findByPk(loginUserId, {
        include: [
          { model: User, as: 'Followings' }
        ]
      })
    ])
      .then(([pUser, lUser]) => {
        pUser.Followers = pUser.Followers.map(follower => ({
          ...follower.dataValues,
          isFollowed: lUser.Followings.map(f => f.id).includes(follower.id)
        }))
        return res.render('follower', {
          paramUser: pUser.toJSON(),
          followers: pUser.Followers,
          loginUserId: lUser.id
        })
      })
      .catch(err => res.send(err))
  },
  getFollowings: (req, res) => {
    const loginUserId = helpers.getUser(req).id
    const paramUserId = req.params.id
    return Promise.all([
      User.findByPk(paramUserId, {
        include: [
          Tweet,
          { model: User, as: 'Followings' }
        ],
        order: [['Followings', 'createdAt', 'DESC']]
      }),
      User.findByPk(loginUserId, {
        include: [
          { model: User, as: 'Followings' }
        ]
      })
    ])
      .then(([pUser, lUser]) => {
        pUser.Followings = pUser.Followings.map(following => ({
          ...following.dataValues,
          isFollowed: lUser.Followings.map(f => f.id).includes(following.id)
        }))
        return res.render('following', {
          paramUser: pUser.toJSON(),
          followings: pUser.Followings,
          loginUserId: lUser.id
        })
      })
      .catch(err => res.send(err))
  }
}

module.exports = userController