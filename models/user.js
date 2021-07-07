'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class User extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here


      User.hasMany(models.Reply)
      User.hasMany(models.Tweet)

      User.belongsToMany(models.Tweet, {
        through: models.Like,
        foreignKey: 'UserId',
        as: 'LikedTweet'
      })
      User.belongsToMany(User, {
        through: models.Followship,
        foreignKey: 'followingId',
        as: 'Followers'
      })
      User.belongsToMany(User, {
        through: models.Followship,
        foreignKey: 'followerId',
        as: 'Followings'
      })
    }
  };
  User.init({
    account: DataTypes.STRING,
    name: DataTypes.STRING,
    email: DataTypes.STRING,
    password: DataTypes.STRING,
    description: DataTypes.STRING,
    img: DataTypes.STRING,
    bg_img: DataTypes.STRING,
    is_admin: DataTypes.BOOLEAN,
  }, {
    sequelize,
    modelName: 'User',
  });
  return User;
};