const imgur = require('imgur')
const IMGUR_CLIENT_ID = process.env.IMGUR_CLIENT_ID
imgur.setClientId(IMGUR_CLIENT_ID)

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
  imgurFilesHandler
}
