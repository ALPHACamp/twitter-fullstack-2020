const pagiHelper = {
  getOffset (limit = 10, page = 0) {
    // begin with page 0
    return page * limit
  }

}

module.exports = pagiHelper
