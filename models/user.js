"use strict";
const hashPassword = require("../helpers/hashPassword");
const { Model } = require("sequelize");
module.exports = (sequelize, DataTypes) => {
  class User extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
      User.hasMany(models.Post)
      User.hasMany(models.Comment)
      User.hasMany(models.Like)
    }
  }
  User.init(
    {
      email: {
        type: DataTypes.STRING,
        validate: {
          notEmpty: {
            msg: "Email cannot be empty",
          },
        },
        unique: {
          args: true,
          msg: "Email is already used",
        },
      },
      password: {
        type: DataTypes.STRING,
        validate: {
          notEmpty: {
            msg: "Password cannot be Empty",
          },
          len: {
            args: 6,
            msg: "Minimum password length is 6 characters",
          },
        },
      },
      status: {
        type: DataTypes.STRING,
        defaultValue: "Terdaftar",
      },
    },
    {
      sequelize,
      modelName: "User",
      hooks: {
        beforeCreate(user, option) {
          user.password = hashPassword(user.password);
        },
      },
    }
  );
  return User;
};
