const Handlebars = require('handlebars')

Handlebars.registerHelper('lookupPartial', function (partialName) {
  return partialName
})

module.exports = Handlebars
