const db = require('../models')
const user = require('../models/user')
const Tweet = db.Tweet
const Reply = db.Reply
const User = db.User
const Like = db.Like
const Followship = db.Followship

const helpers = require('../_helpers')
const { Op } = require("sequelize")
const sequelize = require('sequelize')

const express = require('express')

const tweetService = {
  getTweets: (req, res) => {
    return Promise.all([
      Tweet.findAll({
        include: [User, Reply,
          { model: User, as: 'LikedUsers' }
        ],
        order: [
          ['createdAt', 'DESC'], // Sorts by createdAt in descending order
        ]
      }),
      User.findAll({
        include: [
          Tweet,
          { model: User, as: 'Followings' },
          { model: User, as: 'Followers' }
        ],
        where: { role: "user" }
      }),
    ]).then(([tweets, users]) => {

      const data = tweets.map(tweet => ({
        ...tweet.dataValues,
        id: tweet.id,  //拿到tweet的id
        description: tweet.description,
        createdAt: tweet.createdAt,
        userName: tweet.User.name,
        userAccount: tweet.User.account,
        isLiked: tweet.LikedUsers.map(d => d.id).includes(helpers.getUser(req).id),
      }))

      return callback({
        tweets: data,
        topUsers: users,
        currentUser: helpers.getUser(req).id
      })
    })
  },

  postTweet: async (req, res) => {
    let { description } = req.body
    if (!description.trim()) {
      req.flash('error_messages', '推文不能空白！')
      return res.redirect('back')
    }
    if (description.length > 140) {
      req.flash('error_messages', '推文不能為超過140字！')
      return res.redirect('back')
    }
    await Tweet.create({
      description: req.body.description,
      UserId: helpers.getUser(req).id
    })
    res.redirect('/tweets')
  }
}

module.exports = tweetService