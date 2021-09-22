'use strict';
module.exports = (sequelize, DataTypes) => {

  const Reply = sequelize.define('Reply', {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    UserId: DataTypes.INTEGER,
    TweetId: DataTypes.INTEGER,
    comment: DataTypes.TEXT,
  }, {});

  Reply.associate = function (models) {
    Reply.belongsTo(models.User);
    Reply.belongsTo(models.Tweet);
  };
  return Reply;
};