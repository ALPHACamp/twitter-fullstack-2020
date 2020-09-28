'use strict';
module.exports = (sequelize, DataTypes) => {
  const Like = sequelize.define('Like', {
  }, {});
  Like.associate = function (models) {
    Like.belongsTo(models.User)
  };
  return Like;
};