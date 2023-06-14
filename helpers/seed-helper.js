const randomNumber = (arr, amount = 1) => {
  const number = arr[Math.floor(Math.random() * arr.length)]
  const index = arr.indexOf(number)
  arr.splice(index, 1)
  const randomNumber = Math.floor(number / amount)
  return randomNumber
}

const userIndex = (i, userLength) => {
  if (i < userLength) {
    return i
  } else {
    return Math.floor(Math.random() * userLength)
  }
}

const followingArr = (users, followingNumber) => {
  const arr = []
  users.forEach(user => {
    const randomIdA = user.id
    for (let i = 0; i < followingNumber / users.length; i++) {
      const usersOther = users.filter(user => user.id !== randomIdA)
      const randomIdB = usersOther[Math.floor(Math.random() * usersOther.length)].id
      arr.push({ randomIdA: randomIdA, randomIdB: randomIdB })
    }
  })
  return arr
}

module.exports = {
  randomNumber,
  userIndex,
  followingArr
}
