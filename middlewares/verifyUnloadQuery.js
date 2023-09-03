const verifyUnloadQuery = (req, res, next) => {
  try {
    let { limit, page } = req.query
    limit = parseInt(limit)
    page = parseInt(page)
    if (!Number.isInteger(limit) && !Number.isInteger(page)) {
      return res.json({ message: 'error', data: {} })
    }
    req.limit = limit
    req.page = page
    return next()
  } catch (error) {
    return next(error)
  }
}

module.exports = verifyUnloadQuery
