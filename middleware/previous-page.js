const previousPage = (req, res, next) => {
  // 判斷有無按上一頁
  const { back } = req.query
  let currentUrl = req.url

  // 如果沒有該變數就先設定為[]，按了上一頁也是
  if (!req.session.historyPage) req.session.historyPage = []
  if (!req.session.previousPage) req.session.previousPage = ''
  // 歷史紀錄
  const historyPage = req.session.historyPage

  // 各頁面網址格式 單一推文/追隨列表/個人頁面/主頁面(推文列)
  const tweetUrl = /\/tweets\/([0-9]+)\/replies/
  const followUrl = /\/users\/([0-9]+)\/(followers|followings)/
  const profileUrl = /\/users\/([0-9]+)\/(tweets|replies|likes)/
  const mainUrl = /\/(tweets$|tweets\/$)/

  // 如果按上一頁將原本目前頁面刪除從歷史刪除並將previousPage指向倒數第2個歷史紀錄
  if (back) {
    // 如果是按上一頁才到此頁面的話 將此頁連結後面加上的back=1清空
    if (/\?back=1/.test(currentUrl)) {
      currentUrl = currentUrl.replace('?back=1', '')
    } else if (/&back=1/.test(currentUrl)) {
      currentUrl = currentUrl.replace('&back=1', '')
    }
    // 按了上一頁，所以將最後一筆歷史紀錄清除
    historyPage.splice(-1)
    // 更新previousPage
    if (historyPage.length === 1) {
      req.session.previousPage = historyPage[0]
    } else {
      req.session.previousPage = historyPage[historyPage.length - 2] || ''
    }
  }
  // 重新取得歷史紀錄最後一個的網址
  const lastUrl = historyPage[historyPage.length - 1]

  // 如果使用者不是按上一頁按鈕到此頁 且 目前網址存在
  if (!back && currentUrl) {
    let isDiff = false

    // 目前網址符合推文網址規格 且 歷史紀錄最後一個的網址存在
    if (tweetUrl.test(currentUrl) && lastUrl) {
      // 若currentUrl和 lastUrl都符合推文網址規格 則檢查檢查推文id是否不相同 ex: /tweets/1/replies, /tweets/2/replies
      const matchCurr = currentUrl.match(tweetUrl)
      const matchLast = lastUrl.match(tweetUrl)
      if (matchCurr && matchLast) {
        isDiff = (matchCurr[1] !== matchLast[1])
      }
      // 新頁面網址規格和lastUrl規格不同 或 規格相同但id不同 則push目前頁面到歷史紀錄且更新上一頁的網址
      if (tweetUrl.test(lastUrl) === false || isDiff) {
        historyPage.push(currentUrl)
        req.session.previousPage = historyPage[historyPage.length - 2] || ''
      }
    } else if (followUrl.test(currentUrl) && lastUrl) { // 和追隨者頁面網址規格做檢查
      const matchCurr = currentUrl.match(followUrl)
      const matchLast = lastUrl.match(followUrl)
      if (matchCurr && matchLast) {
        isDiff = (matchCurr[1] !== matchLast[1])
      }
      if (followUrl.test(lastUrl) === false || isDiff) {
        historyPage.push(currentUrl)
        req.session.previousPage = historyPage[historyPage.length - 2] || ''
      }
    } else if (profileUrl.test(currentUrl) && lastUrl) { // 和個人頁面網址規格做檢查
      const matchCurr = currentUrl.match(profileUrl)
      const matchLast = lastUrl.match(profileUrl)
      if (matchCurr && matchLast) {
        isDiff = (matchCurr[1] !== matchLast[1])
      }
      if (profileUrl.test(lastUrl) === false || isDiff) {
        historyPage.push(currentUrl)
        req.session.previousPage = historyPage[historyPage.length - 2] || ''
      }
    } else if (mainUrl.test(currentUrl)) {
      // 若到首頁，清空紀錄
      historyPage.splice(0, historyPage.length)
      historyPage.push(currentUrl)
      req.session.previousPage = ''
    }
  }

  return next()
}

module.exports = previousPage
