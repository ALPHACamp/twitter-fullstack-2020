class JWTTokenError extends Error {
  constructor (message) {
    super(message)
    this.name = 'JWTTokenError'
  }
}
module.exports = {
  JWTTokenError
}
