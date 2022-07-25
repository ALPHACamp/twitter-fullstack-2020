'use strict'
const { Model } = require('sequelize')
module.exports = (sequelize, DataTypes) => {
  class Tweet extends Model {
    static associate(models) {
      Tweet.hasMany(models.Reply, { foreignKey: 'tweetId' })
      Tweet.hasMany(models.Like, { foreignKey: 'tweetId' })
      Tweet.belongsTo(models.User, { foreignKey: 'userId' })
    }
  }
  Tweet.init({
    userId: DataTypes.INTEGER,
    description: DataTypes.TEXT
  }, {
    sequelize,
    modelName: 'Tweet',
    tableName: 'Tweets',
    underscored: true
  })
  return Tweet
}

// 'use strict';
// module.exports = (sequelize, DataTypes) => {
//   const Tweet = sequelize.define('Tweet', {
//   }, {});
//   Tweet.associate = function (models) {
//   };
//   return Tweet;
// };