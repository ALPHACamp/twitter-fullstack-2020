const bcrypt = require('bcryptjs')
const db = require('../models')
const User = db.User
const Followship = db.Followship
const Tweet = db.Tweet
const Reply = db.Reply
const Like = db.Like
const imgur = require('imgur-node-api')
const IMGUR_CLIENT_ID = process.env.IMGUR_CLIENT_ID

const userController = {
  signUpPage: (req, res) => {
    return res.render('signup')
  },

  signUp: (req, res) => {
    if (req.body.passwordCheck !== req.body.password) {
      req.flash('error_messages', "Confirm password doesn't match.")
      return res.redirect('/signUp')
    } else {
      User.findOne({ where: { email: req.body.email } }).then(user => {
        if (user) {
          req.flash('error_messages', 'Email has been used already.')
          return res.redirect('/signUp')
        } else {
          console.log(req.body)
          User.create({
            name: req.body.name,
            email: req.body.email,
            password: bcrypt.hashSync(req.body.password, bcrypt.genSaltSync(10), null)
          }).then(user => {
            req.flash('success_messages', 'Congrat! You have signed up. Please sign in here.')
            return res.redirect('/signIn')
          })
        }
      })
    }
  },

  signInPage: (req, res) => {
    return res.render('signIn')
  },

  signIn: (req, res) => {
    req.flash('success_messages', 'Signed in.')
    res.redirect('/')
  },

  signOut: (req, res) => {
    req.flash('success_messages', 'Signed out.')
    req.logout()
    res.redirect('/signIn')
  },

  getUser: (req, res) => {
    //loginUserId for 判斷編輯資訊頁/跟隨 button鈕是否出現
    let loginUserId = req.user.id
    return User.findByPk(req.params.id, {
      include: [
        { model: User, as: 'Followings' },
        { model: User, as: 'Followers' }
      ]
    })
      .then(user => {
        return User.findAll({
          include: [
            { model: User, as: 'Followers' }
          ]
        }).then(users => {
          // 整理 users 資料
          users = users.map(user => ({
            ...user.dataValues,
            //計算追蹤者人數
            FollowerCount: user.Followers.length,
            // // 判斷目前登入使用者是否已追蹤該 User 物件, passport.js加入 followship以取得req.user.Followings
            isFollowed: req.user.Followings.map(d => d.id).includes(user.id)
          }))
          // 依追蹤者人數排序清單
          users = users.sort((a, b) => b.FollowerCount - a.FollowerCount)
          //將user, users加入陣列回傳
          let results = [user, users]
          return results
        }).then((results) => {
          //取得回傳陣列值
          let user = results[0]
          let users = results[1]
          return Tweet.findAll({
            order: [['createdAt', 'DESC']],
            where: { UserId: user.toJSON().id },
            include: [User, Reply]
          }).then((tweets) => {
            tweets = tweets.map(user => ({ ...user.dataValues, }))
            //取得user following/follower人數
            let followingNum = user.toJSON().Followings.length
            let followerNum = user.toJSON().Followers.length
            //確認get user page是否為跟隨中使用者
            function findIsFollowed(findUser) { return findUser.id === Number(req.params.id) }
            let loginUserisFollowed = users.find(findIsFollowed).isFollowed

            return res.render('profile', { user: user.toJSON(), users: users, followingNum, followerNum, loginUserId, loginUserisFollowed, tweets: tweets })
          })
        })
      })
  },

  editUser: (req, res) => {
    //only login user can enter edit profile page
    if (req.user.id !== Number(req.params.id)) { return res.redirect(`/users/${req.params.id}/tweets`) }
    return User.findByPk(req.params.id)
      .then(user => {
        return res.render('profileEdit', { user: user.toJSON() })
      })
  },

  postUser: (req, res) => {
    if (!req.body.name) {
      req.flash('error_messages', "name can't be space")
      return res.redirect('back')
    }

    const { files } = req
    if (files.avatar !== undefined & files.cover === undefined) {
      imgur.setClientID(IMGUR_CLIENT_ID);
      imgur.upload(files.avatar[0].path, (err, img) => {
        return User.findByPk(req.params.id)
          .then((user) => {
            user.update({
              name: req.body.name,
              introduction: req.body.introduction,
              avatar: files ? img.data.link : user.avatar,
            }).then((user) => {
              req.flash('success_messages', 'profile was successfully to update')
              res.redirect(`/users/${user.id}/tweets`)
            })
          })
      })
    }

    if (files.avatar === undefined & files.cover !== undefined) {
      imgur.setClientID(IMGUR_CLIENT_ID);
      imgur.upload(files.cover[0].path, (err, img) => {
        return User.findByPk(req.params.id)
          .then((user) => {
            user.update({
              name: req.body.name,
              introduction: req.body.introduction,
              cover: files ? img.data.link : user.cover,
            }).then((user) => {
              req.flash('success_messages', 'profile was successfully to update')
              res.redirect(`/users/${user.id}/tweets`)
            })
          })
      })
    }

    if (files.avatar !== undefined & files.cover !== undefined) {
      imgur.setClientID(IMGUR_CLIENT_ID);
      imgur.upload(files.avatar[0].path, (err, img) => {
        return User.findByPk(req.params.id)
          .then((user) => {
            user.update({
              name: req.body.name,
              introduction: req.body.introduction,
              avatar: files ? img.data.link : user.avatar,
            })
              .then(() => {
                imgur.setClientID(IMGUR_CLIENT_ID);
                imgur.upload(files.cover[0].path, (err, img) => {
                  return User.findByPk(req.params.id)
                    .then((user) => {
                      user.update({
                        name: req.body.name,
                        introduction: req.body.introduction,
                        cover: files ? img.data.link : user.cover,
                      }).then((user) => {
                        req.flash('success_messages', 'profile was successfully to update')
                        res.redirect(`/users/${user.id}/tweets`)
                      })
                    })
                })
              })
          })
      })
    }

    else {
      return User.findByPk(req.params.id)
        .then((user) => {
          user.update({
            name: req.body.name,
            introduction: req.body.introduction,
            avatar: user.avatar,
            cover: user.cover,
          })
            .then((user) => {
              req.flash('success_messages', 'profile was successfully to update')
              res.redirect(`/users/${user.id}/tweets`)
            })
        })
    }
  },

  addFollowing: (req, res) => {
    //can not follow/unfollow self
    if (req.user.id === Number(req.params.userId)) { return res.redirect('back') }
    return Followship.create({
      followerId: req.user.id,
      followingId: req.params.userId
    })
      .then((followship) => {
        return res.redirect('back')
      })
  },

  removeFollowing: (req, res) => {
    //can not follow/unfollow self
    if (req.user.id === Number(req.params.userId)) { return res.redirect('back') }
    return Followship.findOne({
      where: {
        followerId: req.user.id,
        followingId: req.params.userId
      }
    })
      .then((followship) => {
        followship.destroy()
          .then((followship) => {
            return res.redirect('back')
          })
      })
  },

  getFollowers: (req, res) => {
    //loginUserId for 判斷編輯資訊頁/跟隨 button鈕是否出現
    let loginUserId = req.user.id
    return User.findByPk(req.params.id)
      .then((user) => {
        return Followship.findAll({
          raw: true,
          nest: true,
          order: [['createdAt', 'DESC']],
          where: { followingId: req.params.id }
        })
          .then((users) => {
            let followerByOrderCreated = users.map(user => user.followerId)
            return User.findAll({
              raw: true,
              nest: true,
              include: [
                { model: User, as: 'Followings' },
                { model: User, as: 'Followers' }
              ],
              where: { id: followerByOrderCreated }
            }).then((users) => {
              // 整理 users 資料
              users = users.map(user => ({
                ...user,
                //計算追蹤者人數
                FollowerCount: user.Followers.length,
                // // 判斷目前登入使用者是否已追蹤該 User 物件, passport.js加入 followship以取得req.user.Followings
                isFollowed: req.user.Followings.map(d => d.id).includes(user.id)
              }))
              followerByOrderCreated = followerByOrderCreated.map(order => {
                return users.find(user => { return user.id === order })
              })
              return res.render('followers', { user: user, users: followerByOrderCreated, loginUserId })
            })
          })
      })
    //return res.render('followers')
  },

  getFollowings: (req, res) => {
    //loginUserId for 判斷編輯資訊頁/跟隨 button鈕是否出現
    let loginUserId = req.user.id
    return User.findByPk(req.params.id)
      .then((user) => {
        return Followship.findAll({
          raw: true,
          nest: true,
          order: [['createdAt', 'DESC']],
          where: { followerId: req.params.id }
        })
          .then((users) => {
            let followingByOrderCreated = users.map(user => user.followingId)
            return User.findAll({
              raw: true,
              nest: true,
              include: [
                { model: User, as: 'Followings' },
                { model: User, as: 'Followers' }
              ],
              where: { id: followingByOrderCreated }
            }).then((users) => {
              // 整理 users 資料
              users = users.map(user => ({
                ...user,
                //計算追蹤者人數
                FollowerCount: user.Followers.length,
                // // 判斷目前登入使用者是否已追蹤該 User 物件, passport.js加入 followship以取得req.user.Followings
                isFollowed: req.user.Followings.map(d => d.id).includes(user.id)
              }))
              followingByOrderCreated = followingByOrderCreated.map(order => {
                return users.find(user => { return user.id === order })
              })
              return res.render('followings', { user: user, users: followingByOrderCreated, loginUserId })
            })
          })
      })
  },

}

module.exports = userController