class JWTTokenError extends Error {
  constructor (message) {
    super(message)
    this.name = 'JWTTokenError'
  }
}
class LocalStrategyError extends Error {
  constructor (message) {
    super(message)
    this.name = 'localStrategyError'
  }
}
class JWTStrategyError extends Error {
  constructor (message) {
    super(message)
    this.name = 'localStrategyError'
  }
}
module.exports = {
  JWTTokenError,
  LocalStrategyError,
  JWTStrategyError
}
