'use strict'

module.exports = (sequelize, DataTypes) => {
  const Reply = sequelize.define('Reply', {
    UserId: DataTypes.INTEGER,
    TweetId: DataTypes.INTEGER,
    content: DataTypes.TEXT
  })

  Reply.associate = function (models) {
    // define association here
    Reply.belongsTo(models.User)
    Reply.belongsTo(models.Tweet)
  };

  return Reply
};