// 計算offset
// 利用limit, page，預設page = 1, limit = 10
const getOffset = (page = 1, limit = 10) => {
  return (page - 1) * limit
}
// 計算pagination需要的資訊，包含總頁數、全部頁數、當前頁數、前一頁、下一頁
const getPagination = (page, limit, total) => {
  // 總頁數
  const totalPage = Math.ceil(total / limit)
  // 全部頁數
  const pages = Array.from({ length: totalPage }, (_, index) => index + 1)
  // 當前頁数，如果頁樹小於1就視為1，如果頁數大於totalPage，就視為totalPage
  const currentPage = page < 1 ? 1 : page > totalPage ? totalPage : page
  // 前一頁，如上
  const prev = currentPage - 1 < 1 ? 1 : currentPage - 1
  // 下一頁，如上
  const next = currentPage + 1 > totalPage ? totalPage : currentPage + 1
  // 頁數判斷是否只有1
  const hasManyPages = totalPage > 1
  return { totalPage, pages, currentPage, prev, next, hasManyPages }
}

module.exports = {
  getOffset,
  getPagination
}
