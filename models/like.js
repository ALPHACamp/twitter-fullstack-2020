'use strict'
module.exports = (sequelize, DataTypes) => {
  const Like = sequelize.define('Like', {
    user_id: DataTypes.INTEGER,
    tweet_id: DataTypes.INTEGER
  }, {
    underscored: true
  })
  Like.associate = function (models) {
    // associations can be defined here
  }
  return Like
}
