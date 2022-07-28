function ensureAuthenticated (req) {
  return req.isAuthenticated()
}

function getUser (req) {
  return req.user || null
}

function getThousands (num) {
  if (num >= 1000) {
    return (num / 1000).toFixed(1) + 'k'
  } else {
    return num
  }
}

module.exports = {
  ensureAuthenticated,
  getUser,
  getThousands
}
