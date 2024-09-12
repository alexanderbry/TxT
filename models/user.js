'use strict';
const { Model } = require('sequelize');
const bcrypt = require('bcrypt');

module.exports = (sequelize, DataTypes) => {
  class User extends Model {
    static associate(models) {
      // Define associations here
      User.hasOne(models.Profile);
      User.hasMany(models.Post);
    }
    getRole(user){
      if(user.role === "admin"){
        return "God"
      }
      if(user.role === "user"){
        return "Newbie"
      }
    }
  }

  User.init({
    username: {
      type : DataTypes.STRING,
      allowNull : false,
      validate : {
        notNull : {
          msg : "Username can't be empty"
        },
        notEmpty : {
          msg : "Username can't be empty"
        }
      }
    },
    email: {
      type : DataTypes.STRING,
      allowNull : false,
      validate : {
        notNull : {
          msg : "Email can't be empty"
        },
        notEmpty : {
          msg : "Email can't be empty"
        }
      }
    },
    password: {
      type : DataTypes.STRING,
      allowNull : false,
      validate : {
        notNull : {
          msg : "Password can't be empty"
        },
        notEmpty : {
          msg : "Password can't be empty"
        }
      }
    },
    role: {
      type: DataTypes.STRING,
      defaultValue: 'user',
      allowNull : false,
      validate : {
        notNull : {
          msg : "Role can't be empty"
        },
        notEmpty : {
          msg : "Role can't be empty"
        }
      }
    }
  }, {
    hooks: {
      beforeSave: async (user, options) => {
          try {
            const salt = await bcrypt.genSalt(10);
            const hash = await bcrypt.hash(user.password, salt);
            user.password = hash;
          } catch (error) {
            throw new Error("Password hashing failed");
          }
      }
    },
    sequelize,
    modelName: 'User',
  });

  return User;
};