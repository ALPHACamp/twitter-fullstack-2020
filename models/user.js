"use strict";

module.exports = (sequelize, DataTypes) => {
  const User = sequelize.define(
    "User",
    {
      email: { type: DataTypes.STRING, defaultValue: "Bibi@bibi.com" },
      password: { type: DataTypes.STRING, defaultValue: "swanswanCat" },
      name: {
        type: DataTypes.STRING,
        defaultValue: "Sparkling Cocktail"
      },
      avatar: { type: DataTypes.STRING, defaultValue: "/upload/noImage-head.jpg" },
      account: { type: DataTypes.TEXT, defaultValue: "Bibi" },
      introduction: { type: DataTypes.STRING, defaultValue: "My Intro..." },
      cover: {
        type: DataTypes.TEXT,
        defaultValue: "/upload/noImage-banner.jpg"
      },
      role: { type: DataTypes.STRING, defaultValue: "user" }
    },
    {}
  );
  User.associate = function (models) {
    User.hasMany(models.Reply);
    User.hasMany(models.Tweet);
    User.hasMany(models.Like);
    User.belongsToMany(User, {
      through: models.Followship,
      foreignKey: "followingId",
      as: "Followers"
    });
    User.belongsToMany(User, {
      through: models.Followship,
      foreignKey: "followerId",
      as: "Followings"
    });
    User.belongsToMany(models.Tweet, {
      through: models.Like,
      foreignKey: "UserId",
      as: "LikedTweets"
    });
  };
  return User;
};
