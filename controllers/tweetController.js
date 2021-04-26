const exphbs = require('express-handlebars')
const path = require('path')
const { Tweet, Reply, User, Like } = require('../models')
const { getUser } = require('../_helpers')
const hbsHelpers = require('../config/handlebars-helper')
const userService = require('../services/userService')

function formatDate(date) {
  function twoDigits(num) {
    if (num > 10) return num
    return '0' + num.toString()
  }
  const year = date.getFullYear()
  const month = date.getMonth() + 1
  const day = date.getDate()
  const hours = date.getHours()
  const minutes = date.getMinutes()
  const AMorPM_string = hours < 12 ? '上午' : '下午'

  return `${AMorPM_string}${twoDigits(hours)}:${twoDigits(minutes)} • ${year}年${month}月${day}日`
}

//for popup
const src = path.parse(__dirname).dir
let ex = exphbs.create({
  layoutsDir: path.join(src, "views/layouts"),
  partialsDir: path.join(src, "views/partials"),
  defaultLayout: 'main',
  extname: '.hbs',
  helpers: hbsHelpers
})

const tweetController = {
  getTweets: (req, res) => {
    Tweet.findAll(
      {
        include: [
          User,
          Reply,
          Like
        ],
        order: [['createdAt', 'DESC']]
      }
    ).then((tweets) => {
      const pageTitle = '首頁'
      const isUserPage = true;
      tweets = tweets.map(d => {
        return {
          ...d.dataValues,
          name: d.User.name,
          account: d.User.account,
          avatar: d.User.avatar,
          replyAmount: d.Replies.length,
          isLike: d.Likes.map(l => l.UserId).includes(getUser(req).id),
          likeNumber: d.Likes.length
        }
      })
      //推薦跟隨
      userService.getTopUsers(req, res, (data) => {
        res.render('tweets', { tweets, pageTitle, isUserPage, ...data })
      })
    })
      .catch(e => {
        console.warn(e)
      })
  },
  getTweet: (req, res) => {
    const tweet_id = req.params.id

    Tweet.findOne(
      {
        where: { id: tweet_id },
        include: [
          User,
          { model: Reply, include: [User] },
          Like
        ]
      }
    ).then((tweet) => {
      const pageTitle = '推文'
      const time = formatDate(tweet.createdAt)
      //推薦跟隨
      userService.getTopUsers(req, res, (data) => {
        // console.log(data)
        res.render('tweet', {
          tweet: tweet.toJSON(),
          pageTitle,
          time,
          replyAmount: tweet.Replies.length,
          isLike: tweet.Likes.map(l => l.UserId).includes(getUser(req).id),
          likeNumber: tweet.Likes.length,
          ...data
        })
      })
    })
      .catch(e => {
        console.warn(e)
      })
  },

  likeTweet: (req, res) => {
    const loginUser = getUser(req)
    //不能重複喜歡
    Like.findOne({
      where: {
        UserId: loginUser.id,
        TweetId: req.params.id
      }
    })
      .then(like => {
        if (like) {
          req.flash('warning_msg', 'You cannot like the same tweet twice')
          return res.redirect('back')
        }
        return Like.create({
          UserId: loginUser.id,
          TweetId: req.params.id
        })
          .then(() => res.redirect('back'))
          .catch(err => res.send(err))
      })
  },
  unlikeTweet: (req, res) => {
    const loginUser = getUser(req)
    Like.destroy({
      where: {
        UserId: loginUser.id,
        TweetId: req.params.id
      }
    })
      .then(() => {
        return res.redirect('back')
      })
      .catch(err => res.send(err))
  },

  //popup
  getAddTweet: (req, res) => {
    ex.render(path.join(src, "views/partials/addNewTweet.hbs"))
      .then(function (template) {
        return res.json({ template })
      })
      .catch(e => console.log(e))
  },
  addTweet: (req, res) => {
    const user_id = getUser(req).id
    const { description } = req.body
    if (!description) return res.redirect('back')
    Tweet.create(
      {
        UserId: user_id,
        description
      }
    ).then(() => {
      res.redirect('back')
    })
      .catch(e => console.warn(e))
  },
  getAddReply: (req, res) => {
    const tweet_id = req.params.id

    Tweet.findOne(
      {
        where: { id: tweet_id },
        include: [
          User,
          { model: Reply, include: User }
        ]
      }
    ).then(tweet => {
      tweet = tweet.toJSON()
      let name = tweet.User.name
      let account = tweet.User.account
      let avatar = tweet.User.avatar
      let description = tweet.description
      let Replies = tweet.Replies
      let createdAt = tweet.User.createdAt
      ex.render(path.join(src, "views/partials/addNewReply.hbs"), { user: getUser(req), id: tweet_id, name, account, avatar, description, createdAt, Replies })
        .then(function (template) {
          return res.json({ template })
        })
        .catch(e => console.log(e))
    })
      .catch(e => console.warn(e))
  },
  addReply: (req, res) => {
    const user_id = getUser(req).id
    const tweet_id = req.params.id
    const { comment } = req.body
    if (!comment) return res.redirect('back')
    Reply.create(
      {
        comment,
        UserId: user_id,
        TweetId: tweet_id
      }
    ).then(() => {
      return res.redirect('back')
    })
      .catch(e => console.warn(e))
  }
}


module.exports = tweetController