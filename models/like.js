'use strict';
module.exports = (sequelize, DataTypes) => {
  const Like = sequelize.define('Like', {
    id: {
      allowNull: false,
      autoIncrement: true,
      primaryKey: true,
      type: DataTypes.INTEGER
    },
    UserId: {
      type: DataTypes.INTEGER
    },
    TweetId: {
      type: DataTypes.INTEGER
    },
  }, {});
  Like.associate = function (models) {
    Like.belongsTo(models.User, {
      foreignKey: 'UserId',
      as: 'user'
    })
    Like.belongsTo(models.Tweet, {
      foreignKey: 'TweetId',
      as: 'tweet'
    })
  };
  return Like;
};