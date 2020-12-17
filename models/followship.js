'use strict';
module.exports = (sequelize, DataTypes) => {
  const Followship = sequelize.define('Followship', {
    followerId: {
      type: DataTypes.INTEGER,
    },
    followingId: {
      type: DataTypes.INTEGER,
    },
  }, {});
  Followship.associate = function (models) {
  };
  return Followship;
};

/*
'use strict';
const { Model } = require('sequelize');

module.exports = (sequelize, DataTypes) => {
  class Followship extends Model {
    static associate(models) {
    }
  };
  Followship.init({
    followerId: DataTypes.INTEGER,
    followingId: DataTypes.INTEGER
  }, {
    sequelize,
    modelName: 'Followship',
  });
  return Followship;
};
*/