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

class FollowshipError extends Error {
  constructor (message) {
    super(message)
    this.name = 'followshipError'
  }
}

class LikeError extends Error {
  constructor (message) {
    super(message)
    this.name = 'likeError'
  }
}
module.exports = {
  JWTTokenError,
  LocalStrategyError,
  JWTStrategyError,
  FollowshipError,
  LikeError
}
