const fs = require('fs')
const imgur = require('imgur')
const IMGUR_CLIENT_ID = process.env.IMGUR_CLIENT_ID
imgur.setClientId(IMGUR_CLIENT_ID)

const localFilesHandler = files => { // file 是 multer 處理完的檔案
  return new Promise((resolve, reject) => {
    if (!files) return resolve(null)
    for (const file of files) {
      const fileName = `upload/${file.originalname}`
      fs.promises.readFile(file.path)
        .then(data => fs.promises.writeFile(fileName, data))
        .then(() => resolve(`/${fileName}`))
        .catch(err => reject(err))
    }
  })
}

const imgurFilesHandler = files => {
  return new Promise((resolve, reject) => {
    if (!files) return resolve(null)
    for (const file of files) {
      imgur.uploadFile(file.path)
        .then(img => {
          resolve(img?.link || null) // 檢查 img 是否存在
        })
        .catch(err => reject(err))
    }
  })
}

module.exports = {
  localFilesHandler,
  imgurFilesHandler
}
