function emailVerify(email) {
  const emailRule = /^\w+((-\w+)|(\.\w+))*\@[A-Za-z0-9]+((\.|-)[A-Za-z0-9]+)*\.[A-Za-z]+$/
  return emailRule.test(email) ? true : false
}

module.exports = emailVerify 