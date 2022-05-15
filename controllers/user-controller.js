const bcrypt = require('bcryptjs') 
const db = require('../models')
const { User, Tweet, Reply, Like } = db
const { localFileHandler } = require('../helpers/file-helpers') 
const userController = {
  signInPage: (req, res) => {
    res.render('signin')
  }, 
  signIn: (req, res) => {
    req.flash('success_messages', '登入成功!')
    res.redirect('/tweets')
    
  },
  signUpPage: (req, res) => {
    res.render('register')
  },
  signUp: (req, res, next) => {
    if (req.body.password !== req.body.checkPassword) throw new Error('Password do not match!')
    Promise.all([User.findOne({ where: { email: req.body.email } }), User.findOne({ where: { account: req.body.account } })])
      .then(([userEmail, userAccount]) => {
        if (userEmail) throw new Error('Email already exists!')
        if (userAccount) throw new Error('Account already exists!')
        return bcrypt.hash(req.body.password, 10)
      })
      .then(hash => User.create({
        account: req.body.account,
        name: req.body.name,
        email: req.body.email,
        password: hash
      }))
      .then(() => {
        req.flash('success_message', '成功註冊帳號!')
        res.redirect('/signin')
      })
      .catch(err => next(err))
  },
  logout: (req, res) => {
    req.flash('success_messages', '登出成功!')
    req.logout()
    res.redirect('/signin')
  },
  getSetting: (req, res, next) => {
    const id = Number(req.params.id)
    return User.findByPk(id)
      .then(user =>{
        if (!user) throw new Error("User doesn't exist!")
        if (user.id !== req.user.id) throw new Error("Can't get other's profile")
        user = user.toJSON()
        res.render('profile', { user })
      }).catch(err => next(err))
  },
  putSetting: (req, res, next) => {
    const id = Number(req.params.id)
    const { account, name, email, password, passwordCheck } = req.body
    if (!account) throw new Error('User account is required!')
    if (!password) throw new Error('User password is required!')
    if (password !== passwordCheck) throw new Error('Please confirm the password')
    Promise.all([
      User.findByPk(id),
      User.findByPk(account),
      User.findByPk(email)
      ])
      .then(([userId,userAccount,userEmail]) => {
        if (req.user.id !== id) throw new Error("Cannot edit other's profile")
        if (!userId) throw new Error("User doesn't exist!")
        if (userAccount) throw new Error("Account already exist!")
        if (userEmail) throw new Error("Email already exist!")
        return bcrypt.hash(req.body.password, 10)
        .then(hash => {
          return userId.update({
          account,
          name,
          email,
          password: hash
          })
        })
      })
      .then(() => {
        req.flash('success_messages', '使用者資料編輯成功')
        res.redirect('/')
      })
      .catch(err => next(err))
  },
  getUser: async(req, res, next) => {
    try {
        const UserId = req.params.id
        const data = await User.findByPk(UserId, {
            include:[
                { model: Tweet, include: [Reply] },
                { model: Reply, include: { model: Tweet, include: [User]}},
                { model: User, as: 'Followings' },
                { model: User, as: 'Followers' }
            ]        
        })
        if (!data) throw new Error ("User didn't exists!")
        return res.json((data.toJSON()))
                 
    } catch (err) {
        next(err)
    }
},
getLikes: async(req, res, next) => {
  try {
      const UserId = req.params.id
      const user = await User.findByPk(UserId, {
          include: [
              { model : Like, include: [ { model : Tweet, include: [User] }]},
              { model: User, as: 'Followings' },
              { model: User, as: 'Followers' }
          ]
      })
      if (!user) throw new Error ("User didn't exists!")
      
      return res.json((user.toJSON()))
  } catch (err) {
      next(err)
  }
},
editProfile: async(req, res, next) => {
  try {
      const UserId = req.params.id
      const user = await  User.findOne({ where: { id: UserId } , 
          include: [
                  { model: User, as: 'Followings' },
                  { model: User, as: 'Followers' } ,     
          ],
          raw: true
        })
        if (!user) throw new Error("User didn't exist!")
        console.log(user)
        return res.json(user)
  } catch (err) {
      next(err)
  }
},
 getFollowers: async(req, res) => {
   try {
    const UserId = req.params.id
    const data = await User.findByPk(UserId, {
        include: [
            { model: User, as: 'Followers' },
        ],
        order: [['createdAt','DESC']]
    })
    if (!data) throw new Error ("User didn't exists!")
    
    return res.json((data.toJSON()))
   } catch (err) {
     next(err)
   }
 },
 getFollowings: async(req, res) => {
  try {
   const UserId = req.params.id
   const data = await User.findByPk(UserId, {
       include: [
           { model: User, as: 'Followings' },
       ],
       order: [['createdAt','DESC']]
   })
   if (!data) throw new Error ("User didn't exists!")
   
   return res.json((data.toJSON()))
  } catch (err) {
    next(err)
  }
},

}
module.exports = userController
