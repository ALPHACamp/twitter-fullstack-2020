module.exports = {
  unitConvertor: num => {
    const sign = { '': 1, k: 1000, m: 1000000, b: 1000000000 }
    for (const [key, value] of Object.entries(sign)) {
      const dividedNum = num / value
      if (dividedNum >= 1 && dividedNum < 1000) {
        return dividedNum.toString() + key
      }
    }
    return '0'
  }
}
