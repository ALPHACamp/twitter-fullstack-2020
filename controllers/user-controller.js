const bcrypt = require('bcryptjs')
const { Op } = require('sequelize')
const { User, Followship, Like, Tweet, Reply } = require('../models')
const { imgurFileHandler } = require('../helpers/file-helpers')
const helpers = require('../_helpers')
const { getTop10Following } = require('../helpers/getTop10Following-helper')

const userController = {
  signUpPage: (req, res) => {
    res.render('signup')
  },
  signUp: async (req, res, next) => {
    try {
      const { account, name, email, password, checkPassword } = req.body
      const errors = []

      if (!account || !name || !email || !password || !checkPassword) {
        errors.push('所有欄位皆為必填')
      }

      const findUser = await User.findOne({
        where: { [Op.or]: [{ account }, { email }] }, // Op.or: 表示接下來陣列內的條件之一成立即可
        attributes: ['account', 'email'] // 若有找到，只返回 account 和 email 屬性即可
      })

      if (findUser && findUser.account === account) {
        errors.push('此帳號已被註冊')
      }
      if (name.length > 50) {
        errors.push('名稱不能超過 50 個字')
      }
      if (findUser && findUser.email === email) {
        errors.push('此 Email 已被註冊')
      }
      if (password !== checkPassword) {
        errors.push('兩次輸入的密碼不相同')
      }
      if (errors.length > 0) {
        throw new Error(errors.join('\n & \n'))
      }

      const hash = await bcrypt.hash(req.body.password, 10)
      await User.create({ account, name, email, password: hash, role: 'user' })

      req.flash('success_messages', '成功註冊帳號！')
      return res.redirect('/signin')
    } catch (err) {
      next(err)
    }
  },
  signInPage: (req, res) => {
    res.render('signin')
  },
  signIn: async (req, res, next) => {
    try {
      req.flash('success_messages', '成功登入！')
      res.redirect('/tweets')
    } catch (err) {
      next(err)
    }
  },
  logout: (req, res) => {
    req.flash('success_messages', '登出成功！')
    req.logout()
    res.redirect('/signin')
  },
  getUser: async (req, res, next) => {
    const userTweet = true
    const userTweets = true
    const { id } = req.params
    const userId = helpers.getUser(req).id
    // User 點擊他人頭像會擋掉，先刪除
    // const loginUser = helpers.getUser(req)
    // if (loginUser.id !== Number(id)) throw new Error('您沒有權限查看此個人資料')
    try {
      const [user, FollowingsCount, FollowersCount, tweetsCount, isFollowed] =
        await Promise.all([
          User.findByPk(id, {
            include: [{ model: Tweet, include: User }]
          }),
          // 計算user的folowing數量
          Followship.count({
            where: { follower_id: id }
          }),
          // 計算user的folower數量
          Followship.count({
            where: { following_id: id }
          }),
          // 計算user的推文數
          Tweet.count({
            where: { user_id: id }
          }),
          Followship.findOne({
            where: { follower_id: userId, following_id: id }
          })
        ])
      // 抓出此user發過的tweet
      const tweets = await Tweet.findAll({
        raw: true,
        where: { user_id: id }
      })
      // 找出所有tweet的回覆樹根喜歡數
      const tweetData = await Promise.all(
        tweets.map(async tweet => {
          // 找出每篇的喜歡及回覆數
          const tweetId = tweet.id
          const [replies, likes, thisTweet, thisUser, isLiked] =
            await Promise.all([
              Reply.count({ where: { tweet_id: tweetId } }),
              Like.count({ where: { tweet_id: tweetId } }),
              Tweet.findByPk(tweetId),
              User.findByPk(id),
              Like.findOne({ where: { tweet_id: tweetId, user_id: id } })
            ])
          tweet.repliesCount = replies
          tweet.likesCount = likes
          tweet.description = thisTweet.description
          tweet.createdAt = thisTweet.createdAt
          tweet.userName = thisUser.name
          tweet.account = thisUser.account
          tweet.avatar = thisUser.avatar || 'https://i.imgur.com/mhXz6z9.png?1'
          tweet.isLiked = isLiked

          return tweet
        })
      )

      if (!user) throw new Error('該用戶不存在!')
      const userData = {
        ...user.toJSON(),
        cover: user.cover || 'https://i.imgur.com/TGRK7uy.png',
        avatar: user.avatar || 'https://i.imgur.com/mhXz6z9.png?1',
        FollowingsCount,
        FollowersCount,
        tweetsCount,
        isFollowed
      }

      const top10Followers = await getTop10Following(req, next)
      return res.render('self-tweets', {
        user: userData,
        userTweet,
        tweet: tweetData,
        userTweets,
        topFollowers: top10Followers,
        userId
      })
    } catch (err) {
      next(err)
    }
  },
  getUserFollowing: async (req, res, next) => {
    try {
      const loginUser = helpers.getUser(req)
      const id = Number(req.params.id)

      const [user, currentUser] = await Promise.all([
        User.findByPk(id, {
          include: [
            { model: User, as: 'Followings' },
            { model: User, as: 'Followers' },
            { model: Tweet }
          ],
          nest: true
        }),
        User.findByPk(loginUser.id, { raw: true })
      ])

      if (!user) throw new Error('帳號不存在')

      const tweetsLength = user.Tweets.length
      const followingList = loginUser.Followings.map(f => f.id)

      const followings = user
        .toJSON()
        .Followings.map(following => ({
          ...following,
          isFollowed: followingList.includes(following.id)
        }))
        .sort((a, b) => b.Followship.createdAt - a.Followship.createdAt)
      const top10Followers = await getTop10Following(req, next)

      return res.render('following', {
        topFollowers: top10Followers,
        user: user.toJSON(),
        tweetsLength,
        currentUser,
        users: followings,
        isFollowings: true
      })
    } catch (err) {
      next(err)
    }
  },
  getUserFollower: async (req, res, next) => {
    try {
      const loginUser = helpers.getUser(req)
      const id = Number(req.params.id)

      const [user, currentUser] = await Promise.all([
        User.findByPk(id, {
          include: [
            { model: User, as: 'Followings' },
            { model: User, as: 'Followers' },
            { model: Tweet }
          ],
          nest: true
        }),
        User.findByPk(loginUser.id, { raw: true })
      ])

      if (!user) throw new Error('帳號不存在')

      const tweetsLength = user.Tweets.length
      const followingList = loginUser.Followings.map(f => f.id)

      const followers = user
        .toJSON()
        .Followers.map(follower => ({
          ...follower,
          isFollowed: followingList.includes(follower.id)
        }))
        .sort((a, b) => b.Followship.createdAt - a.Followship.createdAt)
      const top10Followers = await getTop10Following(req, next)

      return res.render('follower', {
        topFollowers: top10Followers,
        user: user.toJSON(),
        tweetsLength,
        currentUser,
        users: followers,
        isFollowers: true
      })
    } catch (err) {
      next(err)
    }
  },
  getOther: (req, res) => {
    res.render('other-tweets')
  },
  //* 追蹤功能
  addFollowing: async (req, res, next) => {
    try {
      const userId = helpers.getUser(req).id
      const followingId = req.body.id
      //! 不能用自用錯誤處理..
      // if (req.user.id == followingId) throw new Error('不能追蹤自己')

      if (userId == followingId)
        return res.status(200).json({ error: '不能追蹤自己' })

      const user = await User.findByPk(userId)

      if (!user) throw new Error('找不到該用戶')
      await Followship.create({
        followerId: userId,
        followingId
      })
      return res.redirect('back')
    } catch (err) {
      next(err)
    }
  },
  removeFollowing: async (req, res, next) => {
    try {
      const userId = helpers.getUser(req).id
      const followingId = req.params.id
      const user = await User.findByPk(userId)
      if (!user) throw new Error('找不到該用戶')
      const followShip = await Followship.findOne({
        where: { followerId: userId, followingId }
      })
      if (!followShip) throw new Error('還沒有追蹤用戶')
      await followShip.destroy()
      return res.redirect('back')
    } catch (err) {
      next(err)
    }
  },
  //* Like tweet
  addLike: async (req, res, next) => {
    try {
      const tweet = await Tweet.findByPk(req.params.id)
      if (!tweet) throw new Error('找不到該篇推文')
      await Like.create({ tweetId: req.params.id, userId: req.user.id })
      return res.redirect('back')
    } catch (err) {
      next(err)
    }
  },
  removeLike: async (req, res, next) => {
    try {
      const like = await Like.findOne({
        where: { userId: req.user.id, tweetId: req.params.id }
      })
      like.destroy()
      return res.redirect('back')
    } catch (err) {
      next(err)
    }
  },
  //* 帳戶/個人資料設定
  editUserAccount: async (req, res, next) => {
    const userRoute = true
    const { id } = req.params
    const userId = helpers.getUser(req).id
    // console.log('id:' + id)
    // console.log('loginUser:' + loginUser)
    // ? 抓不到 id ＆ loginUser 資料
    // if (loginUser.id !== Number(id)) throw new Error('您沒有權限編緝帳戶')

    try {
      const user = await User.findByPk(id, {
        raw: true
      })
      if (!user) throw new Error('該用戶不存在!')
      return res.render('account-setting', { user, userRoute, userId })
    } catch (err) {
      next(err)
    }
  },
  putUserAccount: async (req, res, next) => {
    const { id } = req.params
    const loginUser = helpers.getUser(req)
    const { account, name, email, password, checkPassword } = req.body
    const saltNumber = 10
    if (loginUser.id !== Number(id)) return res.redirect('back')

    try {
      // 找對應user、找出是否有account、email
      const [user, isAccountExist, isEmailExist] = await Promise.all([
        User.findByPk(id),
        // 如果account, email有值就搜尋
        User.findOne({ where: { account: account || '' } }),
        User.findOne({ where: { email: email || '' } })
      ])

      if (!user) throw new Error('該用戶不存在!')
      // 如果account、email有更動就判斷是否有重複
      if (user.account !== account && isAccountExist) {
        throw new Error('該帳號已存在!')
      }
      if (user.email !== email && isEmailExist) {
        throw new Error('該email已存在!')
      }
      // 確認name有無超過50字
      if (name?.length > 50) throw new Error('該名字超過字數上限 50 個字!')
      // 確認密碼是否正確
      if (password !== checkPassword) throw new Error('密碼不一致!')
      // 將密碼hash
      let hashedPassword = 0
      if (password) {
        const salt = bcrypt.genSaltSync(saltNumber)
        hashedPassword = bcrypt.hashSync(password, salt)
      }

      // 更新資料
      await user.update({
        // 如果是空的就代入資料庫的值
        account: account || user.account,
        name: name || user.name,
        email: email || user.email,
        password: hashedPassword || user.password
      })
      req.flash('success_messages', '已更新成功！')
      return res.redirect('back')
    } catch (err) {
      next(err)
    }
  },
  putUserInfo: async (req, res, next) => {
    try {
      const { id } = req.params
      const { name, introduction } = req.body
      const { files } = req

      if (name?.length > 50) throw new Error('名稱不能超過 50 個字')
      if (introduction?.length > 160) {
        throw new Error('自我介紹不能超過 160 個字')
      }

      const [user, avatarPath, coverPath] = await Promise.all([
        User.findByPk(id),
        imgurFileHandler(files?.avatar ? files.avatar[0] : null),
        imgurFileHandler(files?.cover ? files.cover[0] : null)
      ])

      await user.update({
        name,
        introduction,
        avatar: avatarPath || user.avatar,
        cover: coverPath || user.cover
      })

      req.flash('success_messages', '已更新成功！')
      return res.redirect('back')
    } catch (err) {
      next(err)
    }
  },
  getUserReplies: async (req, res, next) => {
    const userTweet = true
    const userReply = true
    const { id } = req.params
    const userId = helpers.getUser(req).id
    try {
      const [user, FollowingsCount, FollowersCount, tweetsCount] =
        await Promise.all([
          User.findByPk(id, {
            include: [{ model: Tweet, include: User }]
          }),
          // 計算user的folowing數量
          Followship.count({
            where: { follower_id: id }
          }),
          // 計算user的folower數量
          Followship.count({
            where: { following_id: id }
          }),
          // 計算user的推文數
          Tweet.count({
            where: { user_id: id }
          })
        ])
      const replies = await Reply.findAll({
        raw: true,
        where: { user_id: id }
      })

      const replyData = await Promise.all(
        replies.map(async reply => {
          const userId = reply.userId
          const tweetId = reply.tweetId
          const [userData, tweetData] = await Promise.all([
            User.findByPk(userId),
            Tweet.findByPk(tweetId)
          ])
          const tweetOwner = await User.findByPk(tweetData.userId)
          reply.userName = userData.name
          reply.userAccount = userData.account
          reply.avatar = userData.avatar || 'https://i.imgur.com/mhXz6z9.png?1'
          reply.tweetOwner = tweetOwner.account

          return reply
        })
      )
      const userData = {
        ...user.toJSON(),
        cover: user.cover || 'https://i.imgur.com/TGRK7uy.png',
        avatar: user.avatar || 'https://i.imgur.com/mhXz6z9.png?1',
        FollowingsCount,
        FollowersCount,
        tweetsCount
      }
      const top10Followers = await getTop10Following(req, next)
      return res.render('self-replies', {
        user: userData,
        replies: replyData,
        userTweet,
        userReply,
        topFollowers: top10Followers,
        userId
      })
    } catch (err) {
      next(err)
    }
  },
  getUserLikes: async (req, res, next) => {
    const userTweet = true
    const userLike = true
    const { id } = req.params
    const userId = helpers.getUser(req).id

    try {
      const [user, FollowingsCount, FollowersCount, tweetsCount] =
        await Promise.all([
          User.findByPk(id, {
            include: [{ model: Tweet, include: User }]
          }),
          // 計算user的folowing數量
          Followship.count({
            where: { follower_id: id }
          }),
          // 計算user的folower數量
          Followship.count({
            where: { following_id: id }
          }),
          // 計算user的推文數
          Tweet.count({
            where: { user_id: id }
          })
        ])

      const likes = await Like.findAll({
        raw: true,
        where: { userId: id }
      })
      const likesData = await Promise.all(
        likes.map(async like => {
          const tweetId = like.tweetId
          const thisTweet = await Tweet.findByPk(tweetId)
          const ownerData = await User.findByPk(thisTweet.userId)
          const replyCount = await Reply.count({ where: { tweet_id: tweetId } })
          const likeCount = await Like.count({ where: { tweet_id: tweetId } })

          like.name = ownerData.name
          like.account = ownerData.account
          like.avatar = ownerData.avatar || 'https://i.imgur.com/mhXz6z9.png?1'
          like.createdAt = thisTweet.createdAt
          like.description = thisTweet.description
          like.replyCount = replyCount
          like.likeCount = likeCount

          return like
        })
      )
      const userData = {
        ...user.toJSON(),
        cover: user.cover || 'https://i.imgur.com/TGRK7uy.png',
        avatar: user.avatar || 'https://i.imgur.com/mhXz6z9.png?1',
        FollowingsCount,
        FollowersCount,
        tweetsCount
      }
      const top10Followers = await getTop10Following(req, next)
      return res.render('self-likes', {
        user: userData,
        likes: likesData,
        userTweet,
        userLike,
        topFollowers: top10Followers,
        userId
      })
    } catch (err) {
      next(err)
    }
  }
}
module.exports = userController
