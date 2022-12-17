'use strict'
module.exports = (sequelize, DataTypes) => {
<<<<<<< HEAD
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
    isLike: DataTypes.BOOLEAN,
    UserId: DataTypes.INTEGER,
    TweetId: DataTypes.INTEGER,
    isLike: DataTypes.BOOLEAN
  }, {
    sequelize,
    modelName: 'Like',
    tableName: 'Likes'
  })
=======
  const Like = sequelize.define('Like', {
  }, {})
  Like.associate = function (models) {
  }
>>>>>>> 6e335317cb2566ef50768591a6f7ea99269dd2fd
  return Like
}
