const getOffsetAdminTweets = (limit = 10, page = 1) => (page - 1) * limit

const getPaginationAdminTweets = (limit = 10, page = 1, total = 100) => {
  const totalPage = Math.ceil(total / limit)
  const pages = Array.from({ length: totalPage }, (_, index) => index + 1)
  const currentPage = page < 1 ? 1 : page > totalPage ? totalPage : page
  const prev = currentPage - 1 < 1 ? 1 : currentPage - 1
  const next = currentPage + 1 > totalPage ? totalPage : currentPage + 1

  return {
    pages,
    totalPage,
    currentPage,
    prev,
    next
  }
}

const getOffsetAdminUsers = (limit = 10, page = 1) => (page - 1) * limit

const getPaginationAAdminUsers = (limit = 10, page = 1, total = 10) => {
  const totalPage = Math.ceil(total / limit)
  const pages = Array.from({ length: totalPage }, (_, index) => index + 1)
  const currentPage = page < 1 ? 1 : page > totalPage ? totalPage : page
  const prev = currentPage - 1 < 1 ? 1 : currentPage - 1
  const next = currentPage + 1 > totalPage ? totalPage : currentPage + 1

  return {
    pages,
    totalPage,
    currentPage,
    prev,
    next
  }
}

module.exports = {
  getOffsetAdminTweets,
  getPaginationAdminTweets,
  getOffsetAdminUsers,
  getPaginationAAdminUsers
}
