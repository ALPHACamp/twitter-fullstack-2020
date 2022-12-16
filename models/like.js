'use strict'
<<<<<<< HEAD
module.exports = (sequelize, DataTypes) => {
  const Like = sequelize.define('Like', {
  }, {})
  Like.associate = function (models) {
  }
  return Like
}
=======
const {
  Model
} = require('sequelize')

module.exports = (sequelize, DataTypes) => {
  class Like extends Model {
    static associate(models) {
      Like.belongsTo(models.User, { foreignKey: 'UserId'})
      Like.belongsTo(models.Tweet, { foreignKey: 'TweetId'})
    }
  };
  Like.init({
    id: {
      allowNull: false,
      autoIncrement: true,
      primaryKey: true,
      type: DataTypes.INTEGER
    },
    UserId: DataTypes.INTEGER,
    TweetId: DataTypes.INTEGER,
    isLike: DataTypes.BOOLEAN
  }, {
    sequelize,
    modelName: 'Like',
    tableName: 'Likes'
  })
  return Like
}
>>>>>>> fe99ea42a98a36c1b067f7d56776b8d43d2f57f4
