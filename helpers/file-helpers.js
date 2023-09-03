const { createReadStream } = require('fs')

const { ImgurClient } = require('imgur')
const client = new ImgurClient({
  clientId: process.env.CLIENT_ID,
  clientSecret: process.env.CLIENT_SECRET,
  refreshToken: process.env.REFRESH_TOKEN
})

const imgurFileHandler = async files => {
  try {
    const { avatar, cover } = files

    const avatarLink = avatar
      ? await client.upload({
        image: createReadStream(avatar[0].path),
        type: 'stream '
      })
      : null

    const coverLink = cover
      ? await client.upload({
        image: createReadStream(cover[0].path),
        type: 'stream '
      })
      : null

    return {
      avatarLink: avatarLink ? avatarLink.data.link : null,
      coverLink: coverLink ? coverLink.data.link : null
    }
  } catch (error) {
    throw error(error)
  }
}

module.exports = {
  imgurFileHandler
}
