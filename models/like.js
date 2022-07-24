'use strict'
const { Model } = require('sequelize')
module.exports = (sequelize, DataTypes) => {
  class Like extends Model {
    static associate(models) {
      Like.belongsTo(models.User, { foreignKey: 'UserId' })
      Like.belongsTo(models.Tweet, { foreignKey: 'TweetId' })
    }
  }
  Like.init({
    UserId: DataTypes.INTEGER,
    TweetId: DataTypes.INTEGER
  }, {
    sequelize,
    modelName: 'Like',
    tableName: 'Likes'
  })
  return Like
}


// 'use strict';
// module.exports = (sequelize, DataTypes) => {
//   const Like = sequelize.define('Like', {
//   }, {});
//   Like.associate = function(models) {
//   };
//   return Like;
// };