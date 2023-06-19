const faker = require('faker')

const generateLimitedParagraph = function (wordLimit) {
  const paragraph = faker.lorem.paragraph()
  const limitedParagraph = paragraph.slice(0, wordLimit)
  return limitedParagraph
}

module.exports = {
  generateLimitedParagraph
}
