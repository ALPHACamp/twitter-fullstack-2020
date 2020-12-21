'use strict';
module.exports = (sequelize, DataTypes) => {
  const Reply = sequelize.define('Reply', {
    comment: {
      type: DataTypes.TEXT,
    },
  }, {});
  Reply.associate = function(models) {
    Reply.belongsTo(models.User)
    Reply.belongsTo(models.Tweet)
  };
  return Reply;
};

/*

'use strict';
const { Model } = require('sequelize');

module.exports = (sequelize, DataTypes) => {
  class Reply extends Model {
    static associate(models) {
    }
  };
  Reply.init({
    comment: DataTypes.TEXT,
  }, {
    sequelize,
    modelName: 'Reply',
  });
  return Reply;
};*/