const previousPage = (req, res, next) => {
  // 判斷有無按上一頁
  const { back } = req.query
  let currentUrl = req.url
  if (back) {
    currentUrl = currentUrl.replace('back=1', '')
  }

  // 如果沒有該變數就先設定為[]，按了上一頁也是
  if (!req.session.historyPage) req.session.historyPage = []
  // 歷史紀錄
  req.session.historyPage.push(currentUrl)
  const historyPage = req.session.historyPage

  // 追隨清單上一頁
  const isFollowUrl = currentUrl.match(/\/users\/[0-9]+\/followers/) || currentUrl.match(/\/users\/[0-9]+\/followings/)
  if (isFollowUrl) {
    for (let i = historyPage.length - 1; i >= 0; i--) {
      if (
        !(
          // 相同頁簽
          (historyPage[i].match(/\/users\/[0-9]+\/followers/) || historyPage[i].match(/\/users\/[0-9]+\/followings/))
        )
      ) {
        historyPage.push(currentUrl)
        break
        // return next()
      } else {
        historyPage.pop()
      }
    }
  }

  const isProfileUrl =
    currentUrl.match(/\/users\/[0-9]+\/tweets/) || currentUrl.match(/\/users\/[0-9]+\/replies/) || currentUrl.match(/\/users\/[0-9]+\/likes/)
  if (isProfileUrl) {
    for (let i = historyPage.length - 1; i >= 0; i--) {
      if (
        !(
          historyPage[i].match(/\/users\/[0-9]+\/tweets/) ||
          historyPage[i].match(/\/users\/[0-9]+\/replies/) ||
          historyPage[i].match(/\/users\/[0-9]+\/likes/)
        )
      ) {
        historyPage.push(currentUrl)
        break
        // return next()
      } else {
        historyPage.pop()
      }
    }
  }

  // 如果按上一頁將原本的頁面以及目前頁面從historyPage刪除
  if (back) {
    historyPage.splice(-2)
  }
  req.session.previousPage = historyPage[historyPage.length - 2]

  return next()
}

module.exports = previousPage
