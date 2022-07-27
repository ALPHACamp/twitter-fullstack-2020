const getNoRepeatRandomIndex = (randomRange, length, excludeIndex) => {
  // randomRange: Math.random 要乘的範圍值
  // length: 要輸出的 randomIndex 陣列長度
  // excludeIndex: 要從 randomIndex 排除的值

  const randomIndex = []
  // 若無輸入length則給隨機數，且若有excludeIndex會少1項，故要-1
  length = length || Math.ceil(Math.random() * (randomRange - (excludeIndex ? 1 : 0)))

  while (randomIndex.length < length) {
    const data = Math.floor(Math.random() * randomRange)
    if (!randomIndex.includes(data) && data !== excludeIndex) {
      randomIndex.push(data)
    }
  }

  return randomIndex
}

module.exports = {
  getNoRepeatRandomIndex
}
