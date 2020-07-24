const db = require('../models');
const User = db.User;
const Tweet = db.Tweet;
const Reply = db.Reply;
const Like = db.Like;
const Followship = db.Followship;
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
      isTweet: true,
      tweetsCount: user.Tweets.length,
      followingsCount: user.Followings.length,
      followersCount: user.Followers.length,
      isFollowed: user.Followers.map((d) => d.id).includes(req.user.id)
    };
    let tweets = user.Tweets;
    tweets = tweets.map((tweet) => ({
      ...tweet,
      repliesCount: tweet.whoReply.length,
      likeCount: tweet.TweetWhoLike.length,
      // 用自己tweet 的UserId 判斷有沒有按讚過
      isLiked: tweet.TweetWhoLike.map((d) => d.id).includes(req.user.id)
    }));
    // all user's tweets
    // all user's likes
    // all user's replies
    res.render('userPage', { user, followShip, content: tweets });
  },
  getUserReply: async (req, res) => {

    const id = req.params.id
    const tweetsCount = await Tweet.count({
      where: { UserId: id }
    })
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

    res.render('userPage', { user, followShip, content: replies });
  },
  getUserLike: async (req, res) => {

    const id = req.params.id
    const tweetsCount = await Tweet.count({
      where: { UserId: id }
    })
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

    res.render('userPage', { user, followShip, content: likes });
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
      res.render('user_edit', { user: toEdit.toJSON() });
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
  getFollowShip: async (req, res) => {
    //req.params.followship 判斷顯示哪個資料
    //不是follower & following 倒回上一頁
    //user 頁面是否改同樣方法？
    const { id, followship } = req.params;
    const user = await User.findOne({
      where: { id },
      include: [
        Tweet,
        { model: User, as: 'Followings' },
        { model: User, as: 'Followers' }
      ]
    });
    const count = {
      tweetsCount: user.toJSON().Tweets.length
    };

    if (followship === 'followings') {
      let followings = user.toJSON().Followings;
      followings = followings.map((i) => ({
        ...i,
        isFollowed: req.user.Followings.map((d) => d.id).includes(i.id)
      }));
      res.render('followship', { user: user.toJSON(), followings, count });
    } else if (followship === 'followers') {
      let followers = user.toJSON().Followers;
      followers = followers.map((i) => ({
        ...i,
        isFollowed: req.user.Followers.map((d) => d.id).includes(i.id)
      }));
      res.render('followship', { user: user.toJSON(), followers, count });
    }
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
  putEditProfile: (req, res) => {
    //console.log('req===========', req);
    const { files } = req;
    //console.log('req.files', req.files);
    if (files.length) {
      console.log(files);
      //files.map((file, i) => {
      //if (i == 0) {
      imgur.setClientID(IMGUR_CLIENT_ID);
      imgur.upload(files[0].path, (err, img) => {
        User.findByPk(req.params.id).then((user) => {
          user.update({
            introduction: req.body.introduction,
            backgroundImg: img.data.link
          });
        });
      });
      //}
      //if (i == 1) {
      //imgur.setClientID(IMGUR_CLIENT_ID);
      imgur.upload(files[1].path, (err, img) => {
        User.findByPk(req.params.id).then((user) => {
          user.update({
            introduction: req.body.introduction,
            avatar: img.data.link
          });
        });
      });
      //}
      //});
      return res.redirect(`/users/${req.params.id}`);
      //return res.send('has files');
    } else {
      console.log('req.body=====', req.body);
      User.findByPk(req.params.id).then((user) => {
        user
          .update({
            introduction: req.body.introduction
          })
          .then(() => {
            res.redirect(`/users/${req.params.id}`);
          });
      });
    }

    //}

    //console.log('req.files======', req.files);

    //res.redirect(`/users/${req.params.id}`);
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
    topUsers.filter((user) => user.role === 'user');
    res.locals.topUsers = topUsers;
    return next();
  }
};

module.exports = userController;
