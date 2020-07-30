const db = require('../models');
const User = db.User;
const Tweet = db.Tweet;
const Like = db.Like;
const Reply = db.Reply;
const Followship = db.Followship;
const RepliesLike = db.RepliesLikes
const bcrypt = require('bcryptjs');
const imgur = require('imgur-node-api');
const IMGUR_CLIENT_ID = process.env.IMGUR_CLIENT_ID;
const helper = require('../_helpers')

let userController = {
  loginPage: (req, res) => {
    return res.render('login');
  },
  login: (req, res) => {
    req.flash('success_messages', 'Login successfully');
    return res.redirect('/tweets');
  },
  logout: (req, res) => {
    req.flash('success_messages', '已經成功登出');
    req.logout();
    res.redirect('/signin');
  },
  signUpPage: (req, res) => {
    return res.render('signup');
  },
  signup: (req, res) => {
    if (req.body.password !== req.body.checkPassword) {
      return res.render('signup', {
        error_messages: 'Please check your confirm password',
        name: req.body.name,
        account: req.body.account,
        email: req.body.email,
        password: req.body.password,
        checkPassword: req.body.checkPassword
      });
    }
    User.findOne({ where: { account: req.body.account } }).then((user) => {
      if (user) {
        return res.render('signup', {
          error_messages: 'This account name is not available',
          name: req.body.name,
          account: req.body.account,
          email: req.body.email,
          password: req.body.password,
          checkPassword: req.body.checkPassword
        });
      } else {
        User.findOne({ where: { email: req.body.email } }).then((user) => {
          if (user) {
            return res.render('signup', {
              error_messages: 'This email has been registered',
              name: req.body.name,
              account: req.body.account,
              email: req.body.email,
              password: req.body.password,
              checkPassword: req.body.checkPassword
            });
          }
          User.create({
            name: req.body.name,
            account: req.body.account,
            email: req.body.email,
            password: bcrypt.hashSync(
              req.body.password,
              bcrypt.genSaltSync(10, null)
            ),
            cover:'https://i.imgur.com/elgEQND.jpeg',
            avatar: 'https://i.imgur.com/73A1th4.png',
            role: 'user'
          })
            .then((user) => {
              req.flash('success_messages', 'Signup successfully');
              return res.redirect('/signin');
            })
            .catch((err) => console.log(err));
        });
      }
    });
  },
  getUserPage: async (req, res) => {
    const id = req.params.id;
    let user = await User.findOne({
      where: { id },
      include: [
        {
          model: Tweet,
          include: [
            User,
            Reply,
            Like,
          ]
        },
        { model: User, as: 'Followers' },
        { model: User, as: 'Followings' }
      ]
    });
    user = user.toJSON();
    const followShip = {
      isTweet: true,
      tweetsCount: user.Tweets.length,
      followingsCount: user.Followings.length,
      followersCount: user.Followers.length,
      isFollowed: user.Followers.map((d) => d.id).includes(helper.getUser(req).id)
    };
    let tweets = user.Tweets;
    tweets = tweets.map((tweet) => ({
      ...tweet,
      tweetId: tweet.id,
      userId: user.id,
      userName: user.name,
      userAvatar: user.avatar,
      userAccount: user.account,
      likeCount: tweet.Likes.length,
      replayCount: tweet.Replies.length,
      description: tweet.description,
      isLiked: tweet.Likes.map((d) => d.UserId).includes(helper.getUser(req).id)
    }));
    tweets = tweets.sort((a, b) => b.createdAt - a.createdAt)
    res.render('userPage', {
      user,
      followShip,
      isUserPage: true,
      content: tweets
    });
  },
  getUserReply: async (req, res) => {
    const id = req.params.id;
    let user = await User.findOne({
      where: { id },
      include: [
        Tweet,
        {
          model: Reply, include: [
            {
              model: Tweet, include: [
                Reply,
                User,
                Like,]
            },
            User
          ]
        },
        { model: User, as: 'Followers' },
        { model: User, as: 'Followings' }
      ]
    });
    user = user.toJSON();
    const followShip = {
      isReply: true,
      tweetsCount: user.Tweets.length,
      followingsCount: user.Followings.length,
      followersCount: user.Followers.length,
      isFollowed: user.Followers.map((d) => d.id).includes(helper.getUser(req).id)
    };
    let repliesTweet = user.Replies;


    repliesTweet = repliesTweet.map(r => ({
      ...r,
      tweetId: r.Tweet.id,
      userId: r.Tweet.User.id,
      userName: r.Tweet.User.name,
      userAvatar: r.Tweet.User.avatar,
      userAccount: r.Tweet.User.account,
      description: r.Tweet.description,
      likeCount: r.Tweet.Likes.length,
      replayCount: r.Tweet.Replies.length,
      isLiked: r.Tweet.Likes.map((d) => d.UserId).includes(helper.getUser(req).id)
    }))

    repliesTweet = repliesTweet.sort((a, b) => b.createdAt - a.createdAt)

    res.render('userPage', {
      user,
      followShip,
      isUserPage: true,
      content: repliesTweet
    });
  },
  getUserLike: async (req, res) => {
    const id = req.params.id;
    let user = await User.findOne({
      where: { id },
      include: [
        Tweet,
        {
          model: Like, order: ['createdAt', 'DESC'],
          include: [
            { model: Tweet, include: [User,Like, Reply] }
          ]
        },
        { model: User, as: 'Followers' },
        { model: User, as: 'Followings' }
      ]
    });
    user = user.toJSON();
    const followShip = {
      isLike: true,
      tweetsCount: user.Tweets.length,
      followingsCount: user.Followings.length,
      followersCount: user.Followers.length,
      isFollowed: user.Followers.map((d) => d.id).includes(helper.getUser(req).id)
    };
    let likes = user.Likes;
    likes = likes.map((r) => ({
      ...r,
      tweetId: r.Tweet.id,
      userId: r.Tweet.User.id,
      userName: r.Tweet.User.name,
      userAvatar: r.Tweet.User.avatar,
      userAccount: r.Tweet.User.account,
      description: r.Tweet.description,
      likeCount: r.Tweet.Likes.length,
      replayCount: r.Tweet.Replies.length,
      isLiked: r.Tweet.Likes.map((d) => d.UserId).includes(helper.getUser(req).id)
    }))
    likes = likes.sort((a, b) => b.createdAt - a.createdAt)
    res.render('userPage', {
      user,
      followShip,
      isUserPage: true,
      content: likes
    });
  },
  addLike: async (req, res) => {
    try {
      const newLike = await Like.create({
        UserId: helper.getUser(req).id,
        TweetId: req.params.tweetId
      });
      res.redirect('back');
    } catch (err) {
      console.log(err);
      res.send('something is wrong');
    }
  },
  removeLike: async (req, res) => {
    try {
      const toRemove = await Like.findOne({
        where: {
          UserId: helper.getUser(req).id,
          TweetId: req.params.tweetId
        }
      });
      toRemove.destroy();
      res.redirect('back');
    } catch (err) {
      res.send('something is wrong');
    }
  },
  editUser: async (req, res) => {
    try {
      if (helper.getUser(req).id !== Number(req.params.id)) {
        return res.redirect('back');
      }
        const toEdit = await User.findByPk(req.params.id);
        return res.render('user_edit', {
          user: toEdit.toJSON(),
          isEditPage: true
        });
    } catch (err) {
      console.log(err);
      res.send(err);
    }
  },
  addFollowing: async (req, res) => {
    try {
      if (helper.getUser(req).id === Number(req.body.id)) {
        req.flash('error_messages', 'you cannot follow yourself');
        return res.redirect('back');
      }
        await Followship.create({
          followerId: helper.getUser(req).id,
          followingId: req.body.id
        });
        return res.redirect('back');
      

    } catch (err) {
      res.send('something is wrong');
    }
  },
  removeFollowing: async (req, res) => {
    try {
      const toRemove = await Followship.findOne({
        where: {
          followerId: helper.getUser(req).id,
          followingId: req.params.id
        }
      });
      toRemove.destroy();
      res.redirect('back');
    } catch (err) {
      res.send('something is wrong');
    }
  },
  getFollowings: async (req, res) => {
    const id = req.params.id;
    const user = await User.findOne({
      where: { id },
      include: [
        Tweet,
        { model: User, as: 'Followings' },
        { model: User, as: 'Followers' }
      ]
    });
    const followDetail = {
      tweetsCount: user.toJSON().Tweets.length,
      followings: true
    };
    let followings = user.toJSON().Followings;
    followings = followings.map((i) => ({
      ...i,
      isFollowed: helper.getUser(req).Followings.map((d) => d.id).includes(i.id)
    }));
    followings = followings.sort((a, b) => b.Followship.createdAt - a.Followship.createdAt)
    res.render('followship', {
      isUserPage: true,
      user: user.toJSON(),
      followShip: followings,
      followDetail
    });
  },
  getFollowers: async (req, res) => {
    const id = req.params.id;
    const user = await User.findOne({
      where: { id },
      include: [
        Tweet,
        { model: User, as: 'Followings' },
        { model: User, as: 'Followers' }
      ]
    });
    const followDetail = {
      tweetsCount: user.toJSON().Tweets.length,
      followers: true
    };
    let followers = user.toJSON().Followers;
    followers = followers.map((i) => ({
      ...i,
      isFollowed: helper.getUser(req).Followers.map((d) => d.id).includes(i.id)
    }));
    followers = followers.sort((a, b) => b.Followship.createdAt - a.Followship.createdAt)
    res.render('followship', {
      isUserPage: true,
      user: user.toJSON(),
      followShip: followers,
      followDetail
    });
  },
  putEditUser: async (req, res) => {
    const id = req.params.id
    const { name, account, email, password } = req.body
    const user = await User.findByPk(id)
    if (!password) {
      user.update({
        name: name,
        account: account,
        email: email,
      })
      req.flash('success_messages', '修改成功！！')
      return res.redirect(`/users/${user.id}/edit`);
    } else {
      user.update({
        name: name,
        account: account,
        email: email,
        password: bcrypt.hashSync(password, bcrypt.genSaltSync(10, null))
      })
      req.flash('success_messages', '修改成功!!!');
      res.redirect(`/users/${user.id}/edit`);
    }
  },
  editProfile: async (req, res) => {
    try {
      if (helper.getUser(req).id !== Number(req.params.id)) {
        return res.redirect('back');
      }
      const toEdit = await User.findByPk(req.params.id);
      res.render('profile_edit', { user: toEdit.toJSON() });
    } catch (err) {
      console.log(err);
      res.send(err);
    }
  },
  putEditProfile: async (req, res) => {
    const id = req.params.id;
    const { introduction } = req.body;
    const { files } = req;

    if (introduction.length > 140) {
      req.flash('error_messages', '自我介紹不能超過140個字')
      return res.redirect('back')
    }
    imgur.setClientID(IMGUR_CLIENT_ID);

    const user = await User.findByPk(id);
    if (files.cover) {
      imgur.upload(files.cover[0].path, (err, img) => {
        user.update({
          cover: img.data.link,
          introduction
        })
          .then((user) => {
            if (files.avatar) {
              imgur.upload(files.avatar[0].path, (err, img) => {
                user.update({
                  avatar: img.data.link,
                  introduction
                })
                  .then((user) => {
                    return res.redirect(`/users/${req.params.id}`);
                  });
              });
            } else {
              return res.redirect(`/users/${req.params.id}`);
            }
          });
      });
    } else if (files.avatar) {
      imgur.upload(files.avatar[0].path, (err, img) => {
        user.update({
          avatar: img.data.link,
          introduction
        })
          .then(() => res.redirect(`/users/${req.params.id}`));
      });
    } else {
      user.update({
        introduction
      })
        .then(() => res.redirect(`/users/${req.params.id}`));
    }
  },

  topUserForLayout: async (req, res, next) => {
    let topUsers = await User.findAll({
      include: [{ model: User, as: 'Followers' }]
    });
    topUsers = topUsers.map((user) => ({
      ...user.dataValues,
      FollowerCount: user.Followers.length,
      isFollowed: helper.getUser(req).Followings.map((d) => d.id).includes(user.id)
    }));

    topUsers.sort((a, b) => b.FollowerCount - a.FollowerCount);
    topUsers = topUsers.filter((user) => user.role === 'user');
    topUsers = topUsers.slice(0, 10);
    res.locals.topUsers = topUsers;
    return next();
  },
  addReplyLike: async (req, res) => {
    try {
      await RepliesLike.create({
        UserId: helper.getUser(req).id,
        ReplyId: req.params.ReplyId
      });
      res.redirect('back');
    } catch (err) {
      console.log(err);
      res.send('something is wrong');
    }
  },
  removeReplyLike: async (req, res) => {
    try {
      const toRemove = await RepliesLike.findOne({
        where: {
          UserId: helper.getUser(req).id,
          ReplyId: req.params.ReplyId
        }
      });
      toRemove.destroy();
      res.redirect('back');
    } catch (err) {
      res.send('something is wrong');
    }
  },
};

module.exports = userController;
