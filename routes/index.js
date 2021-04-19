const express = require('express');
const router = express.Router();

const tweetController = require('../controllers/tweetController');

router.get('/', (req, res) => {
  res.redirect('/tweets');
});
router.get('/tweets', tweetController.getTweets);
router.get('/tweet/:id', tweetController.getTweet);
router.post('/tweet', tweetController.postTweet);
router.put('/tweet/:id', tweetController.putTweet);
router.delete('/tweet/:id', tweetController.deleteTweet);

module.exports = router;
