const previousPage = (req, res, next) => {
  // const currentPage = req.session.currentPage
  const currentUrl = req.url
  // 如果沒有該變數就先設定為[]
  if (!req.session.previousPageArray) req.session.previousPageArray = []
  // 歷史紀錄
  req.session.previousPageArray.push(currentUrl)
  const previousPageArray = req.session.previousPageArray

  // 追隨清單上一頁
  const isFollowUrl = currentUrl.match(/\/users\/[0-9]+\/followers/) || currentUrl.match(/\/users\/[0-9]+\/followings/)
  if (isFollowUrl) {
    for (let i = previousPageArray.length - 1; i >= 0; i--) {
      if (
        !(
          // 相同頁簽
          (previousPageArray[i].match(/\/users\/[0-9]+\/followers/) || previousPageArray[i].match(/\/users\/[0-9]+\/followings/))
        )
      ) {
        req.session.previousPage = previousPageArray[i]
        // 清空歷史紀錄
        req.session.previousPageArray = []
        return next()
      }
    }
  }

  const isProfileUrl =
    currentUrl.match(/\/users\/[0-9]+\/tweets/) || currentUrl.match(/\/users\/[0-9]+\/replies/) || currentUrl.match(/\/users\/[0-9]+\/likes/)
  if (isProfileUrl) {
    for (let i = previousPageArray.length - 1; i >= 0; i--) {
      if (
        !(
          previousPageArray[i].match(/\/users\/[0-9]+\/tweets/) ||
          previousPageArray[i].match(/\/users\/[0-9]+\/replies/) ||
          previousPageArray[i].match(/\/users\/[0-9]+\/likes/)
        )
      ) {
        req.session.previousPage = previousPageArray[i]
        req.session.previousPageArray = []
        return next()
      }
    }
  }

  return next()
}

module.exports = previousPage
