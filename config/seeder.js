const bcrypt = require('bcrypt-nodejs')
const faker = require('faker')

admins = [
  { account: 'root', email: 'root@example.com' },
  //edit for more admins...
]

const USER_ID_BEGIN = admins.length + 1
const USER_COUNT = 5 //edit for more users...
const TWEETS_PER_USER = 10 //edit for more tweets...
const REPLIES_PER_TWEET = 3 //edit for more replies...
const LIKES_PER_TWEET = 3 //edit for more likes...

const TWEET_COUNT = TWEETS_PER_USER * USER_COUNT
const REPLY_COUNT = REPLIES_PER_TWEET * TWEET_COUNT
const LIKE_COUNT = LIKES_PER_TWEET * TWEET_COUNT

const password = '12345678'

function getAdmins() {
  return admins.map((admin, i) => ({
    ...admin,
    id: i + 1,
    name: admin.account,
    password: bcrypt.hashSync(password, bcrypt.genSaltSync(10), null),
    cover: `https://loremflickr.com/320/240/personal,cover/?random=${Math.random() * 100}`,
    avatar: `https://loremflickr.com/320/240/avatar/?random=${Math.random() * 100}`,
    introduction: faker.lorem.text(),
    role: 'admin',
    createdAt: new Date(),
    updatedAt: new Date(),
  }))
}

function getUsers() {
  return Array.from({ length: USER_COUNT }).map((_, i) => {
    const account = `user${i + 1}`
    return {
      id: USER_ID_BEGIN + i,
      name: faker.name.findName(),
      email: `${account}@example.com`,
      password: bcrypt.hashSync(password, bcrypt.genSaltSync(10), null),
      account: account,
      cover: `https://loremflickr.com/320/240/personal,cover/?random=${Math.random() * 100}`,
      avatar: `https://loremflickr.com/320/240/avatar/?random=${Math.random() * 100}`,
      introduction: faker.lorem.text(),
      role: 'user',
      createdAt: new Date(),
      updatedAt: new Date(),
    }
  })
}

function randIndexArray(randLen, FullLen) {
  let leftIndices = [...Array(FullLen).keys()]
  let selectedIndices = []
  for (let i = 0; i < randLen; i++) {
    let randomIndex = Math.floor(Math.random() * leftIndices.length)
    selectedIndices.push(leftIndices.splice(randomIndex, 1)[0])
  }
  return selectedIndices
}

//每則tweet有三個不同人留言, 每人各留一則reply
function getReplies() {
  let replies = Array.from({ length: REPLY_COUNT })
  for (let i = 0; i < TWEET_COUNT; i++) {
    const indexArray = randIndexArray(REPLIES_PER_TWEET, USER_COUNT)
    for (let j = 0; j < REPLIES_PER_TWEET; j++) {
      index = i * REPLIES_PER_TWEET + j
      replies[index] = {
        id: index + 1,
        UserId: indexArray[j] + USER_ID_BEGIN,
        TweetId: i + 1,
        comment: faker.lorem.text(),
        createdAt: faker.date.recent(),
        updatedAt: new Date(),
      }
    }
  }
  return replies
}

//每則tweet有三個不同人like
function getLikes() {
  let likes = Array.from({ length: LIKE_COUNT })
  for (let i = 0; i < TWEET_COUNT; i++) {
    const indexArray = randIndexArray(LIKES_PER_TWEET, USER_COUNT)
    for (let j = 0; j < LIKES_PER_TWEET; j++) {
      index = i * LIKES_PER_TWEET + j
      likes[index] = {
        id: index + 1,
        UserId: indexArray[j] + USER_ID_BEGIN,
        TweetId: i + 1,
        createdAt: faker.date.recent(),
        updatedAt: new Date(),
      }
    }
  }
  return likes
}

/*
前面序號user有後面序號user的follow
user1有user2, user3, user4, user5 follow
user2有user3, user4, user5 follow
user3有user4, user5 follow
user4有user5 follow
user5沒有 follow
user1的popular應為 user2->user3->user4->user5
*/
function getFollowships() {
  let followships = []
  for (let i = 0; i < USER_COUNT; i++) {
    for (let j = i + 1; j < USER_COUNT; j++) {
      followships.push({
        id: followships.length + 1,
        followerId: j + USER_ID_BEGIN,
        followingId: i + USER_ID_BEGIN,
        createdAt: faker.date.recent(),
        updatedAt: new Date(),
      })
    }
  }
  return followships
}

module.exports = {
  USER_ID_BEGIN,
  USER_COUNT,
  TWEETS_PER_USER,
  REPLIES_PER_TWEET,
  LIKES_PER_TWEET,
  TWEET_COUNT,
  REPLY_COUNT,
  LIKE_COUNT,
  getAdmins,
  getUsers,
  getReplies,
  getLikes,
  getFollowships,
}
