'use strict';
module.exports = (sequelize, DataTypes) => {
  const Tweet = sequelize.define('Tweet', {
  }, {});
  Tweet.associate = function(models) {
  };
  Tweet.init(
    {
      description: DataTypes.TEXT,
    },
    {
      sequelize,
      modelName: 'Tweet',
    }
  );
  return Tweet;
};