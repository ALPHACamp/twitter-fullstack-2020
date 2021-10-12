'use strict';
module.exports = (sequelize, DataTypes) => {
  const Reply = sequelize.define('Reply', {
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
    comment: {
      type: DataTypes.TEXT
    },
  }, {});
  Reply.associate = function (models) {
    Reply.belongsTo(models.User, {
      foreignKey: 'UserId',
      as: 'user'
    })
    Reply.belongsTo(models.Tweet, {
      foreignKey: 'TweetId',
      as: 'tweet'
    })
  };
  return Reply;
};