'use strict'
module.exports = (sequelize, DataTypes) => {
  const User = sequelize.define('User', {
    account: DataTypes.STRING,
    name: DataTypes.STRING,
    email: DataTypes.STRING,
    password: DataTypes.STRING,
    intro: DataTypes.TEXT,
    avatar: DataTypes.STRING,
    cover: DataTypes.STRING,
    isAdmin: DataTypes.BOOLEAN
  }, {
    underscored: true
  })
  User.associate = function (models) {
    // associations can be defined here
    User.hasMany(models.Tweet, { foreignKey: 'tweetId' })
    User.hasMany(models.Reply, { foreignKey: 'replyId' })
    User.belongsToMany(models.Tweet, {
      through: models.Like,
      foreignKey: 'userId',
      as: 'LikedTweets'
    })
    User.belongsToMany(models.User, {
      through: models.Followship,
      foreignKey: 'followerId',
      as: 'Followings'
    })
    User.belongsToMany(models.User, {
      through: models.Followship,
      foreignKey: 'followingId',
      as: 'Followers'
    })
  }
  return User
}
