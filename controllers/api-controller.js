const bcrypt = require('bcryptjs')

const { User, Tweet, Reply } = require('../models')
const helpers = require('../_helpers')
const { imgurFilesHandler } = require('../helpers/file-helpers')

const apiController = {
  getUser: (req, res, next) => {
    if (Number(req.params.id) !== helpers.getUser(req).id) {
      return res.json({ status: 'error', message: "Can't update others data" })
    }

    return User.findByPk(req.params.id, {
      include: [
        Tweet,
        Reply,
        { model: Tweet, as: 'LikeTweets' },
        { model: User, as: 'Followings' },
        { model: User, as: 'Followers' }
      ]
    })
      .then(data => {
        if (!data) return res.json({ status: 'error', message: "user isn't existed!" })
        const user = data.toJSON()
        delete user.password

        res.json({ status: 'success', ...user })
      })
      .catch(err => next(err))
  },
  postUser: (req, res, next) => {
    if (Number(req.params.id) !== helpers.getUser(req).id) {
      return res.json({ status: 'error', message: "Can't update others data" })
    }

    const { name, password, introduction, checkPassword } = req.body
    const deleteCover = req.body.delete_cover
    const { files } = req
    let email = req.body.email || ''
    let account = req.body.account || ''

    if (email === helpers.getUser(req)?.email) email = ''
    if (account === helpers.getUser(req)?.account) account = ''
    if (password !== checkPassword) throw new Error('Password must the same.')
    if (!name && !email && !password && !account && !introduction && !files) {
      throw new Error('Need to enter a field.')
    }
    if (name?.length > 50) throw new Error('超過字數上限，name 上限 50 字')
    if (introduction?.length > 160) throw new Error('超過字數上限，自我介紹數字上限 160 字')

    const asyncTasks = [User.findByPk(Number(req.params.id))]
    email ? asyncTasks.push(User.findOne({ where: { email }, raw: true, nest: true })) : asyncTasks.push('')
    account ? asyncTasks.push(User.findOne({ where: { account } })) : asyncTasks.push('')
    files?.avatar ? asyncTasks.push(imgurFilesHandler(files.avatar)) : asyncTasks.push('')
    files?.cover ? asyncTasks.push(imgurFilesHandler(files.cover)) : asyncTasks.push('')
    password ? asyncTasks.push(bcrypt.hash(password, 10)) : asyncTasks.push('')

    // Promise.all 同時尋找email.id.account
    return Promise.all(asyncTasks)
      .then(([user, sameEmail, sameAccount, avatar, cover, newPassword]) => {
        if (sameEmail || sameAccount) throw new Error('無法使用與他人相同的email或account')
        if (!user) return res.json({ status: 'error', message: "user isn't existed!" })
        if (deleteCover === 'on') {
          return user.update({
            name: name,
            introduction: introduction,
            avatar: avatar || user.avatar,
            cover: null
          })
        }

        return user.update({
          name: name,
          email: email || user.email,
          account: account || user.account,
          introduction: introduction,
          avatar: avatar || user.avatar,
          cover: cover || user.cover,
          password: newPassword || user.password
        })
      })
      .then(data => {
        const user = data.toJSON()
        delete user.password

        req.flash('success_messages', '成功修改會員資料')
        if (process.env.NODE_ENV === 'test' || process.env.NODE_ENV === 'travis') {
          res.json({ status: 'success', ...user })
        }
        res.redirect('back')
      })
      .catch(err => next(err))
  }
}

module.exports = apiController
