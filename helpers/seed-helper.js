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

const doNotFollowSelf = users => {
  const randomIdA = users[Math.floor(Math.random() * users.length)].id
  const usersOther = users.filter(user => user.id !== randomIdA)
  const randomIdB = usersOther[Math.floor(Math.random() * usersOther.length)].id
  return {
    follower_id: randomIdA,
    following_id: randomIdB
  }
}

module.exports = {
  randomNumber,
  userIndex,
  doNotFollowSelf
}
