function ifThousand(num) {
    num = Number(num)
    if (num > 1000) {
        num = (num / 1000).toFixed(1)
        return num + "k"
    }
    return num
}

module.exports = {
    ifThousand
  }