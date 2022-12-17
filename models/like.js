'use strict'
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
