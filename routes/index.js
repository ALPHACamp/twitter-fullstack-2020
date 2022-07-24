const express = require('express')
const router = express.Router()
const passport = require('../config/passport')

const helpers = require('../_helpers')
const tweetController = require('../controllers/tweet-controller')
const replyController = require('../controllers/reply-controller')
//前台 tweet 路由

//讀取 所有 tweet
router.get('/tweets', authenticated, tweetController.getTweets)
//讀取 單一 tweet
router.get('/tweets/:tweet_id', authenticated, tweetController.getTweet)
//新增 tweet
router.post('/tweets', authenticated, tweetController.PostTweet)

//前台 reply 路由

//讀取 單一 tweet 的 reply
router.get('/tweets/:tweet_id/replies', authenticated, replyController.getReply)
//新增 單一 tweet 的 reply
router.post('/tweets/:tweet_id/replies', authenticated, replyController.postReply)

//前台 tweet 路由(like)

//新增 單一 tweet 的 like
router.post('/tweets/:tweet_id/like', authenticated, tweetController.like)
//刪除 單一 tweet 的 like
router.post('/tweets/:tweet_id/unlike', authenticated, tweetController.unlike)

//前台 followship 路由

//新增 追隨
router.post('/followships', authenticated, followshipController.addFollowing)
//刪除 追隨
router.delete('/followships/:followingId', authenticated, followshipController.removeFollowing)