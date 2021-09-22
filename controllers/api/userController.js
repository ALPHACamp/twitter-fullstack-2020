const db = require('../../models')
const User = db.User
const Tweet = db.Tweet
const Reply = db.Reply
const Like = db.Like
const Followship = db.Followship

const userService = require('../../services/userService.js')

const { Op } = require("sequelize")
const sequelize = require('sequelize')

let userController = {
  getUserTweets: (req, res) => {
    userService.getUserTweets(req, res, (data) => {
      return res.status(200).json(data)
    })
  },

  //for test
  renderUserEdit: (req, res) => {
    userService.renderUserEdit(req, res, (data) => {
      return res.status(200).json(data)
    })
  },

  //for test
  putUserEdit: (req, res) => {
    userService.putUserEdit(req, res, (data) => {
      return res.status(200).json(data)
    })
  }
}

module.exports = userController