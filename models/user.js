'use strict'
module.exports = (sequelize, DataTypes) => {
  const User = sequelize.define('User', {
    name: DataTypes.STRING,
    account: DataTypes.STRING,
    email: DataTypes.STRING,
    password: DataTypes.STRING,
    avatar: DataTypes.STRING,
    introduction: DataTypes.TEXT,
    cover: DataTypes.STRING,
    isAdmin: DataTypes.BOOLEAN
  }, {
    modelName: 'User',
    tableName: 'Users'
  })
  User.associate = function (models) {
    User.hasMany(models.Tweet, { foreignKey: 'userId' })
  }
  return User
}
