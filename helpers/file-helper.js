const fs = require('fs')
const { ImgurClient } = require('imgur')
const IMGUR_CLIENT_ID = process.env.IMGUR_CLIENT_ID
const imgur = new ImgurClient({ clientId: IMGUR_CLIENT_ID })

const imgurFileHandler = file => {
  return new Promise(async (resolve, reject) => {
    try {
      if (!file) return resolve(null)
      const img = await imgur.upload({
        image: fs.createReadStream(file.path)
      })

      return resolve(img?.data.link || null)
    } catch (err) { reject(err) }
  })
}

module.exports = imgurFileHandler