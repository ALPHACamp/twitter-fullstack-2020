'use strict';
module.exports = (sequelize, DataTypes) => {
  const ReplyComment = sequelize.define('ReplyComment', {
    comment: DataTypes.STRING,
    ReplyId: DataTypes.INTEGER,
    UserId: DataTypes.INTEGER
  }, {});
  ReplyComment.associate = function(models) {
    ReplyComment.belongsTo(models.Reply)
    ReplyComment.belongsTo(models.User)
  };
  return ReplyComment;
};