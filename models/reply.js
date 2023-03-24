'use strict';
const {
  Model
} = require('sequelize')
module.exports = (sequelize, DataTypes) => {
  class Reply extends Model {
    static associate(models) {
      Reply.belongsTo(models.User);
      Reply.belongsTo(models.Tweet);
      Reply.hasMany(models.Like, { foreignKey: 'PositionId' });
      Reply.hasMany(models.Reply, {
        as: 'followingByReply',
        foreignKey: 'ReplyId',
        useJunctionTable: false,
      });
      Reply.belongsToMany(models.User, {
        through: models.Like,
        foreignKey: 'PositionId',
        as: 'LikedByUsers',
      });
    };
  }
  Reply.init({
    UserId: DataTypes.INTEGER,
    TweetId: DataTypes.INTEGER,
    ReplyId: DataTypes.INTEGER,
    comment: DataTypes.TEXT,
  }, {
    sequelize,
    modelName: 'Reply',
    tableName: 'Replies',
    underscored: true
  },
  );
  return Reply;
};
