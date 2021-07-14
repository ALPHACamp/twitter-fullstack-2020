'use strict';

//給定一個array和index，會回傳一個將該 index 位置元素移除掉的 array
function popIndexOfArray(arr, index) {
  if (index >= arr.length || index < 0) {
    return arr
  }
  const A = arr.slice(0, index)
  const B = arr.slice(index + 1)
  return [...A, ...B]
}

//產出配對關係
function followshipGenerator(userArray) {
  let outputArr = []
  for (let i in userArray) {
    const targetMembers = popIndexOfArray(userArray, i)
    for (let user of targetMembers) {
      if (Math.floor(Math.random() * 2) === 0) {
        outputArr.push([userArray[i], user])
      }
    }
  }
  return outputArr
}

//[1,2,...,5,7,...,30] 共 29 不包含 admin
const targetedUsers = Array.from(Array(31).keys()).filter(x => x > 0 && x !== 6)
const followshipList = followshipGenerator(targetedUsers)    //配對關係表

module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.bulkInsert('Followships',
      followshipList.map(pairing => ({
        followerId: pairing[0],
        followingId: pairing[1],
        createdAt: new Date(),
        updatedAt: new Date()
      }))
      // [{
      //   followerId: 2,
      //   followingId: 3,
      //   createdAt: new Date(),
      //   updatedAt: new Date()
      // }, {
      //   followerId: 2,
      //   followingId: 4,
      //   createdAt: new Date(),
      //   updatedAt: new Date()
      // }, {
      //   followerId: 2,
      //   followingId: 5,
      //   createdAt: new Date(),
      //   updatedAt: new Date()
      // }, {
      //   followerId: 3,
      //   followingId: 4,
      //   createdAt: new Date(),
      //   updatedAt: new Date()
      // }, {
      //   followerId: 3,
      //   followingId: 5,
      //   createdAt: new Date(),
      //   updatedAt: new Date()
      // }, {
      //   followerId: 4,
      //   followingId: 6,
      //   createdAt: new Date(),
      //   updatedAt: new Date()
      // }]
      , {})
  },

  down: async (queryInterface, Sequelize) => {
    await queryInterface.bulkDelete('Followships', null, {})
  }
};