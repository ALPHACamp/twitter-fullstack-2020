'use strict';
module.exports = (sequelize, DataTypes) => {
  const Reply = sequelize.define('Reply', {
  }, {});
  Reply.associate = function(models) {
    Reply.belongsTo(models.User)
    Reply.belongsTo(models.Tweet)
  };
  Reply.init({
    comment: DataTypes.TEXT,
    UserId: DataTypes.INTEGER,
    TweetId: DataTypes.INTEGER,
  }, {
    sequelize,
    modelName: 'Reply'
  })
  return Reply;
};