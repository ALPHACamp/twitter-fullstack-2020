'use strict';
module.exports = (sequelize, DataTypes) => {
  const Reply = sequelize.define('Reply', {
    userId: DataTypes.INTEGER,
    tweetId: DataTypes.INTEGER,
    comment: DataTypes.TEXT
  }, {});
  Reply.associate = function (models) {
    // associations can be defined here
    Reply.belongsTo(models.User)
    Reply.belongsTo(models.Tweet)
  };
  return Reply;
};