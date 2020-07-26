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
    res.redirect('/login');
  },
  signUpPage: (req, res) => {
    return res.render('signup');
  },
  signup: (req, res) => {
    //password and confirmPassword must be the same
    if (req.body.password !== req.body.confirmPassword) {
      return res.render('signup', {
        error_messages: 'Please check your confirm password',
        name: req.body.name,
        account: req.body.account,
        email: req.body.email,
        password: req.body.password,
        confirmPassword: req.body.confirmPassword
      });
    }
    //check if account name has been used
    User.findOne({ where: { account: req.body.account } }).then((user) => {
      // if the account name has been used
      if (user) {
        return res.render('signup', {
          error_messages: 'This account name is not available',
          name: req.body.name,
          account: req.body.account,
          email: req.body.email,
          password: req.body.password,
          confirmPassword: req.body.confirmPassword
        });
      } else {
        // the account name is available, check if email has been used
        User.findOne({ where: { email: req.body.email } }).then((user) => {
          if (user) {
            return res.render('signup', {
              error_messages: 'This email has been registered',
              name: req.body.name,
              account: req.body.account,
              email: req.body.email,
              password: req.body.password,
              confirmPassword: req.body.confirmPassword
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
            avatar: 'https://i.imgur.com/73A1th4.png',
            role: 'user'
          })
            .then((user) => {
              req.flash('success_messages', 'Signup successfully');
              return res.redirect('/login');
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
          order: ['createdAt', 'DESC'],
          include: [
            User,
            Reply,
            { model: User, as: 'TweetWhoLike' },
            
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
      isFollowed: user.Followers.map((d) => d.id).includes(req.user.id)
    };
    let tweets = user.Tweets;
    tweets = tweets.map((tweet) => ({
      ...tweet,
      repliesCount: tweet.Replies.length,
      likeCount: tweet.TweetWhoLike.length,
      // 用自己tweet 的UserId 判斷有沒有按讚過
      isLiked: tweet.TweetWhoLike.map((d) => d.id).includes(req.user.id)
    }));
    // all user's tweets
    // all user's likes
    // all user's replies
    res.render('userPage', {
      user,
      followShip,
      isUserPage: true,
      content: tweets
    });
  },
  getUserReply: async (req, res) => {
    const id = req.params.id;
    const tweetsCount = await Tweet.count({
      where: { UserId: id }
    });
    let user = await User.findOne({
      where: { id },
      include: [
        {
          model: Tweet,
          as: 'UserReply',
          order: ['createdAt', 'DESC'],
          include: [
            User,
            { model: User, as: 'TweetWhoLike' },
            { model: User, as: 'whoReply' }
          ]
        },
        { model: User, as: 'Followers' },
        { model: User, as: 'Followings' }
      ]
    });
    user = user.toJSON();
    const followShip = {
      isReply: true,
      tweetsCount,
      followingsCount: user.Followings.length,
      followersCount: user.Followers.length,
      isFollowed: user.Followers.map((d) => d.id).includes(req.user.id)
    };
    let replies = user.UserReply;
    replies = replies.map((reply) => ({
      ...reply,
      repliesCount: reply.whoReply.length,
      likeCount: reply.TweetWhoLike.length,
      // 用自己tweet 的UserId 判斷有沒有按讚過
      isLiked: reply.TweetWhoLike.map((d) => d.id).includes(req.user.id)
    }));

    res.render('userPage', {
      user,
      followShip,
      isUserPage: true,
      content: replies
    });
  },
  getUserLike: async (req, res) => {
    const id = req.params.id;
    const tweetsCount = await Tweet.count({
      where: { UserId: id }
    });
    let user = await User.findOne({
      where: { id },
      include: [
        {
          model: Tweet,
          as: 'userLike',
          order: ['createdAt', 'DESC'],
          include: [
            User,
            { model: User, as: 'TweetWhoLike' },
            { model: User, as: 'whoReply' }
          ]
        },
        { model: User, as: 'Followers' },
        { model: User, as: 'Followings' }
      ]
    });
    user = user.toJSON();
    const followShip = {
      isLike: true,
      tweetsCount,
      followingsCount: user.Followings.length,
      followersCount: user.Followers.length,
      isFollowed: user.Followers.map((d) => d.id).includes(req.user.id)
    };
    let likes = user.userLike;
    likes = likes.map((like) => ({
      ...like,
      repliesCount: like.whoReply.length,
      likeCount: like.TweetWhoLike.length,
      // 用自己tweet 的UserId 判斷有沒有按讚過
      isLiked: like.TweetWhoLike.map((d) => d.id).includes(req.user.id)
    }));

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
        UserId: req.user.id,
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
          UserId: req.user.id,
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
      //check if it's the current user who intends to edit. If not, back to last page
      if (req.user.id !== Number(req.params.id)) {
        return res.redirect('back');
      }
      const toEdit = await User.findByPk(req.params.id);
      res.render('user_edit', {
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
      //check if the user if trying to follow himself
      if (req.user.id == Number(req.params.userId)) {
        req.flash('error_messages', 'you cannot follow yourself');
        return res.redirect('back');
      }
      const newFollowship = await Followship.create({
        followerId: req.user.id,
        followingId: req.params.userId
      });
      res.redirect('back');
    } catch (err) {
      res.send('something is wrong');
    }
  },
  removeFollowing: async (req, res) => {
    try {
      const toRemove = await Followship.findOne({
        where: {
          followerId: req.user.id,
          followingId: req.params.userId
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
      isFollowed: req.user.Followings.map((d) => d.id).includes(i.id)
    }));
    res.render('followship', {
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
      isFollowed: req.user.Followers.map((d) => d.id).includes(i.id)
    }));
    res.render('followship', {
      user: user.toJSON(),
      followShip: followers,
      followDetail
    });
  },
  putEditUser: (req, res) => {
    User.findByPk(req.params.id).then((user) => {
      user
        .update({
          name: req.body.name,
          account: req.body.account,
          email: req.body.email,
          password: bcrypt.hashSync(
            req.body.password,
            bcrypt.genSaltSync(10, null)
          )
        })
        .then((user) => {
          req.flash('success_messages', '修改成功!!!');
          res.redirect(`/users/${user.id}/edit`);
        });
    });
  },
  editProfile: async (req, res) => {
    try {
      //check if it's the current user who intends to edit. If not, back to last page
      if (req.user.id !== Number(req.params.id)) {
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
    //console.log('req.files', req.files);
    imgur.setClientID(IMGUR_CLIENT_ID);

    const user = await User.findByPk(id);
    if (files.backgroundImg) {
      imgur.upload(files.backgroundImg[0].path, async (err, img) => {
        user
          .update({
            backgroundImg: img.data.link,
            introduction
          })
          .then((user) => {
            if (files.avatar) {
              imgur.upload(files.avatar[0].path, (err, img) => {
                user
                  .update({
                    avatar: img.data.link,
                    introduction
                  })
                  .then((user) => {
                    return res.redirect(`/users/${req.params.id}`);
                  });
              });
            } else {
              user
                .update({
                  introduction
                })
                .then(() => res.redirect(`/users/${req.params.id}`));
            }
          });
      });
    } else if (files.avatar) {
      imgur.upload(files.avatar[0].path, (err, img) => {
        user
          .update({
            avatar: img.data.link,
            introduction
          })
          .then(() => res.redirect(`/users/${req.params.id}`));
      });
    } else {
      user
        .update({
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
      isFollowed: req.user.Followings.map((d) => d.id).includes(user.id)
    }));

    topUsers.sort((a, b) => b.FollowerCount - a.FollowerCount);
    topUsers = topUsers.filter((user) => user.role === 'user');
    topUsers = topUsers.slice(0, 10);
    res.locals.topUsers = topUsers;
    return next();
  },
  addReplyLike: async (req, res) => {
    try{
      await RepliesLike.create({
        UserId: req.user.id,
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
          UserId: req.user.id,
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
