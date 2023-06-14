const fs = require('fs') // 引入 fs 模組

// 把 multer 處理完並放在temp的檔案複製一份到upload/ 並回傳路徑
const localFileHandler = file => { // file 是 multer 處理完的檔案
  return new Promise((resolve, reject) => {
    // 先檢查是否有檔案傳入
    if (!file) return resolve(null)
    // 定義目的路徑
    const fileName = `upload/${file.originalname}`
    // 讀傳入的檔 然後寫到新的檔 回傳檔案路徑
    return fs.promises.readFile(file.path)
      .then(data => fs.promises.writeFile(fileName, data))
      .then(() => resolve(`/${fileName}`))
      .catch(err => reject(err))
  })
}
module.exports = {
  localFileHandler
}
