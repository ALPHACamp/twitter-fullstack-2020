'use strict';
module.exports = (sequelize, DataTypes) => {
  const Reply = sequelize.define('Reply', {
    UserId: DataTypes.INTEGER,
    TweetId: DataTypes.INTEGER,
    comment: DataTypes.STRING
  }, {});
  Reply.associate = function(models) {  
    Reply.belongsTo(models.Tweet)
    Reply.belongsTo(models.User)  
    Reply.belongsToMany(models.User, {
      through: models.RepliesLikes,
      foreignKey: 'ReplyId',
      as: 'ReplyWhoLike'
    })
  };
  return Reply;
};