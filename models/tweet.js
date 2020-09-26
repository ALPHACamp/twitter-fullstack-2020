'use strict';
module.exports = (sequelize, DataTypes) => {
  const Tweet = sequelize.define(
    'Tweet',
    {
      description: DataTypes.TEXT,
      UserId: DataTypes.INTEGER,
    },
    {},
  );
  Tweet.associate = function (models) {
    Tweet.belongsTo();
  };
  return Tweet;
};

// tweet 欄位可以自由定
