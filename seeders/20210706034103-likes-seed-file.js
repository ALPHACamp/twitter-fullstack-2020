'use strict';

function drawFromArray(arr, num) {
  if (num > arr.length) throw new Error('Error of drawFromArray - Sampling Size too big')

  const drawQuantity = num
  let samples = []
  for (let item of arr) {
    samples.push(item)
  }

  let count = 1
  let output = []
  while (samples.length > 0 && count <= drawQuantity) {
    const randomIndex = Math.floor(Math.random() * samples.length)
    const pickedOne = samples.splice(randomIndex, 1)[0]
    output.push(pickedOne)
    count++
  }
  return output
}

function likeRelationGenerator() {
  const userList = [1, 2, 3, 4]  //假所所有user只有這些
  const tweetList = Array.from(Array(50).keys()).slice(10) //[10,11,...49]

  let output = []
  for (let user of userList) {   //每個user挑選幾個執行like
    const samplingNumber = Math.floor(Math.random() * 10) + 5   //挑選數量
    const pickedOnes = drawFromArray(tweetList, samplingNumber).map(tweet => [user, tweet])    //[[3,5],[3,8],[3,15]...]
    output.push(...pickedOnes)
  }
  return output
}

const likeRelationList = likeRelationGenerator()

module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.bulkInsert('Likes',
      likeRelationList.map(paring => ({
        UserId: paring[0],
        TweetId: paring[1],
        createdAt: new Date(),
        updatedAt: new Date()
      })))
  },

  down: async (queryInterface, Sequelize) => {
    await queryInterface.bulkDelete('Likes', null, {})
  }
};
