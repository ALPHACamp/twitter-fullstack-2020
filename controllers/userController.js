const imgur = require('imgur-node-api')
const IMGUR_CLIENT_ID = 'c26a5187596e138'
const bcrypt = require('bcryptjs')
const db = require('../models')
const User = db.User;
const Tweet = db.Tweet;
const Reply = db.Reply;
const Followship = db.Followship;
const helpers = require('../_helpers')


const userController = {
  signUpPage: (req, res) => {
    return res.render('signup')
  },

  signUp: (req, res) => {
    // confirm password
    if (req.body.passwordCheck !== req.body.password) {
      req.flash('error_messages', 'differenct passwords！')
      return res.redirect('/signup')
    } else {
      // confirm unique user
      User.findOne({ where: { account: req.body.account } }).then(user => {
        if (user) {
          req.flash('error_messages', 'same account')
          return res.redirect('/signup')
        } else {
          User.create({
            account: req.body.account,
            name: req.body.name,
            email: req.body.email,
            password: bcrypt.hashSync(req.body.password, bcrypt.genSaltSync(10), null)
          }).then(user => {
            req.flash('success_messages', 'registered successfully')
            return res.redirect('/signin')
          })
        }
      })
    }
  },
  signInPage: (req, res) => {
    return res.render('signin')
  },
  signIn: (req, res) => {
    req.flash('success_messages', "成功登入！")
    res.redirect('/tweets')
  },
  logout: (req, res) => {
    req.flash('success_messages', '成功登出!')
    req.logout()
    res.redirect('/signin')
  },
  editUser: (req, res) => {
    return User.findByPk(req.params.id)
      .then(user => {
        return res.render('user/self/edit')
      })
  },
  putUser: (req, res) => {

    // if (!req.body.name) {
    //   console.log(req.body.name)
    //   req.flash('error_messages', "name didn't exist")
    //   return res.redirect('back')
    // }
    const { file } = req
    if (file) {
      imgur.setClientID(IMGUR_CLIENT_ID)
      imgur.upload(file.path, (err, img) => {
        return User.findByPk(req.params.id)
          .then(user => {
            user.update({
              name: req.body.name,
              avatar: file ? img.data.link : null,
              background: file ? img.data.link : null,
              introduction: req.body.introduction
            }).then(user => {
              req.flash('success_messages', 'user was successfully update')
              res.redirect(`/user/self`)
            })
          })
      })
    } else {
      return user.findByPk(req.params.id)
        .then(user => {
          user.update({
            name: req.body.name,
            avatar: user.avatar,
            background: user.background,
            introduction: req.body.introduction
          })
            .then(user => {
              req.flash('success_messages', 'user was successfully update')
              res.redirect('/user/{{user.id}}/self')
            })
        })
    }
  },
  getSetting: (req, res) => {
    return res.render('setting')
  },

  putSetting: (req, res) => {

    return User.findByPk(req.user.id)
      .then(user => {
        user.update({
          account: req.body.account,
          name: req.body.name,
          email: req.body.email,
          password: bcrypt.hashSync(req.body.password, bcrypt.genSaltSync(10), null)
        })
          .then(user => {
            req.flash('success_messages', 'user was successfully update')
            res.redirect('setting')
          })
      })
  },
  getFollower: (req, res) => {
    return User.findByPk(req.params.id, {
      include: [
        Tweet,
        { model: User, as: 'Followers' }]
    })
      .then(user => {
        const followerList = user.Followers.map(user => ({
          ...user.dataValues,
          isFollowed: req.user.Followings.map(d => d.id).includes(user.id)
        }))
        console.log(followerList);
        return res.render('follower', { user, followerList })
      })
  },
  getFollowing: (req, res) => {
    return User.findByPk(req.params.id, {
      include: [Tweet,
        { model: User, as: 'Followings' }]
    })
      .then(user => {
        const followingList = user.Followings.map(user => ({
          ...user.dataValues,
          isFollowed: req.user.Followings.map(d => d.id).includes(user.id)
        }))
        return res.render('following', { user, followingList })
      })
  },
  addFollowing: (req, res) => {
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
  getUsersHavingTopFollowers: (req, res, next) => {
    return User.findAll({
      include: [{ model: User, as: 'Followers' }]
    })
      .then(users => {
        users = users.map(user => ({
          ...user.dataValues,
          isFollowed: req.user.Followings.map(d => d.id).includes(user.id),
          FollowersCount: user.Followers.length
        }))
        users = users.sort((a, b) => b.FollowersCount - a.FollowersCount).slice(0, 10)
        res.locals.users = users;
        return next()
      })
  },
  //austin
  getTweets: (req, res) => {
    return User.findByPk(req.params.id, {
      include: [
        {
          model: Tweet, include: [
            { model: Reply },
            { model: User, as: 'LikeUsers' }
          ]
        },
        { model: User, as: 'Followers' },
        { model: User, as: 'Followings' },
      ],
      order: [['Tweets', 'createdAt', 'DESC']]
    })
      .then(user => {
        const pageUser = user.toJSON();
        pageUser.Tweets.forEach(t => {
          t.isLiked = t.LikeUsers.map(d => d.id).includes(req.user.id);
        })
        pageUser.followingCount = pageUser.Followings.length;
        pageUser.followersCount = pageUser.Followers.length;
        pageUser.isFollowed = helpers.getUser(req).Followings.map(item => item.id).includes(req.user.id)
        res.render('user/user-tweets', { pageUser })
      })
  },
  // ann
  getTweet: (req, res) => {
    return User.findByPk(req.params.id, {
      include: [
        { model: Tweet, include: [Reply, { model: User, as: 'LikeUsers' },] },
        { model: User, as: 'Followers' },
        { model: User, as: 'Followings' },
      ],
      order: [['Tweets', 'createdAt', 'DESC']]
    })
      .then(user => {
        const selfUser = user.toJSON();
        selfUser.Tweets.forEach(t => {
          t.isLiked = t.LikeUsers.map(d => d.id).includes(req.user.id)
        })
        res.render('user/self', { selfUser })
      })
  },
  getReplies: (req, res) => {
    return User.findByPk(req.params.id, {
      include: [
        { model: User, as: 'Followers' },
        { model: User, as: 'Followings' },
        {
          model: Reply, include: [
            {
              model: Tweet, include: [
                User,
                Reply,
                { model: User, as: 'LikeUsers' }]
            }
          ],
        }
      ],
      order: [['Replies', 'createdAt', 'DESC']]
    })
      .then(user => {
        const pageUser = user.toJSON();
        pageUser.Replies.forEach(r => {
          r.Tweet.isLiked = r.Tweet.LikeUsers.map(d => d.id).includes(req.user.id)
        })
        pageUser.followingCount = pageUser.Followings.length;
        pageUser.followersCount = pageUser.Followers.length;
        // pageUser.isFollowed = helpers.getUser(req).Followings.map(item => item.id).includes(pageUser.id)
        res.render("user/user-replies", { pageUser });
      })
  },
  getlikes: (req, res) => {
    return User.findByPk(req.params.id, {
      include: [
        { model: Tweet, as: 'LikeTweets', include: [User, Reply, { model: User, as: 'LikeUsers' }] },
        { model: User, as: 'Followers' },
        { model: User, as: 'Followings' },
      ],
      order: [['LikeTweets', 'createdAt', 'DESC']],
    })
      .then(user => {
        const pageUser = user.toJSON();
        pageUser.LikeTweets.forEach(l => {
          l.isLiked = true
        })
        pageUser.followingCount = pageUser.Followings.length;
        pageUser.followersCount = pageUser.Followers.length;
        // pageUser.isFollowed = helpers.getUser(req).Followings.map(item => item.id).includes(pageUser.id)
        res.render("user/user-likes", { pageUser });
      })
  },
  otherUser: (req, res) => {
    return User.findByPk(req.params.id, {
      include: [
        { model: Tweet, include: [Reply, { model: User, as: "LikeUsers" }] },
        {
          model: Reply, include: [
            { model: Tweet, include: [User, Reply, { model: User, as: "LikeUsers" }] }
          ]
        },
        {
          model: Tweet, as: "LikeTweets", include: [
            User, Reply, { model: User, as: "LikeUsers" }
          ]
        },
        { model: User, as: "Followings" },
        { model: User, as: "Followers" },
      ]
    })
      .then(user => {
        //特定使用者 - 推文 排序依日期
        // user.Tweets = user.Tweets.map(tweet => ({
        //   ...tweet.dataValues,
        //   userName: user.name,
        //   userAvatar: user.avatar,
        //   userAccount: user.account,
        //   countReplies: tweet.toJSON().Replies.length,
        //   countLikeUser: tweet.toJSON().LikeUsers.length,
        // }));
        // user.Tweets = user.Tweets.sort((a, b) => b.createdAt.getTime() - a.createdAt.getTime());
        // //特定使用者 - 回文 排序依日期
        // user.Replies = user.Replies.map(reply => ({
        //   ...reply.dataValues,
        //   tweet: reply.Tweet.toJSON(),
        //   isLike: reply.Tweet.LikeUsers.some(user=> user.toJSON().id === req.user.id ), 
        //   countReplies: reply.Tweet.toJSON().Replies.length,
        //   countLikeUser: reply.Tweet.toJSON().LikeUsers.length
        // }))
        // user.Replies = user.Replies.sort((a, b) => b.createdAt.getTime() - a.createdAt.getTime());
        // //特定使用者 - 喜歡的推文 排序依日期
        // user.LikeTweets = user.LikeTweets.map(l => ({
        //   ...l.dataValues,
        //   likeTweet: l.Like.toJSON(),
        //   user: l.User.toJSON(),
        //   countReplies: l.toJSON().Replies.length,
        //   countLikeUser: l.toJSON().LikeUsers.length
        // }));
        // user.LikeTweets = user.LikeTweets.sort((a, b) => b.likeTweet.createdAt.getTime() - a.likeTweet.createdAt.getTime());
        // // 特定使用者 - 被追蹤 排序依日期
        // user.Followers = user.Followers.map(f => f.toJSON());
        // user.Followers = user.Followers.sort((a, b) => b.createdAt.getTime() - a.createdAt.getTime());
        // // 特定使用者 - 跟隨 排序依日期
        // user.Followings = user.Followings.map(f => f.toJSON());
        // user.Followings = user.Followings.sort((a, b) => b.createdAt.getTime() - a.createdAt.getTime());
        // console.log(user.toJSON());
        // res.render("user/other", {
        //   user,
        //   tweets: user.Tweets,
        //   replies: user.Replies,
        //   // followers: user.Followers,
        //   // followings: user.Followings,
        //   likes: user.LikeTweets
        // });
      })
  },

}

module.exports = userController