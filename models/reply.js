'use strict';
module.exports = (sequelize, DataTypes) => {
  const Reply = sequelize.define('Reply', {
  }, {});
  Reply.associate = function (models) {
    Reply.belongsTo(models.User)
  };
  return Reply;
};