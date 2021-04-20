'use strict';
module.exports = (sequelize, DataTypes) => {
  const Reply = sequelize.define('Reply', {
  }, {});
  Reply.associate = function(models) {
    Reply.belongsTo(models.User)
    Reply.belongsTo(models.Tweet)
    Reply.hasMany(models.likes)
  };
  return Reply;
};