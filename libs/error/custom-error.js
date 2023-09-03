class LocalStrategyError extends Error {
  constructor (message) {
    super(message)
    this.name = 'localStrategyError'
  }
}

class CustomError extends Error {
  constructor (message, name) {
    super(message)
    this.name = name
  }
}

module.exports = {
  LocalStrategyError,
  CustomError
}