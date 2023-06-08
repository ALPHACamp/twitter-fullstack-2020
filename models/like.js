'use strict'
const { DataTypes, Model } = require('sequelize')

module.exports = sequelize => {
  class Like extends Model {
    static associate(models) {
      //* like屬於tweet和user
      Like.belongsTo(models.Tweet, { foreignKey: 'tweetId' })
      Like.belongsTo(models.User, { foreignKey: 'userId' })
    }
  }
  Like.init(
    {
      UserId: DataTypes.INTEGER,
      TweetId: DataTypes.INTEGER
    },
    {
      sequelize,
      modelName: 'Like',
      tableName: 'Likes',
      underscored: true
    }
  )
  return Like
}
