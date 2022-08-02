const fs = require('fs')

const localFileHandler = file => {
  // file 是 multer 處理完的檔案
  return new Promise((resolve, reject) => {
    // 檔案不存在直接 return
    if (!file) {
      return resolve(null)
    }

    // multer 預設暫存在 /temp 資料夾，這邊 copy 一份到 upload 資料夾
    const fileName = `upload/${file.originalname}`
    return fs.promises
      .readFile(file.path)
      .then(data => fs.promises.writeFile(fileName, data))
      .then(() => resolve(`/${fileName}`))
      .catch(err => reject(err))
  })
}

module.exports = {
  localFileHandler
}
