'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Profile extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
      Profile.belongsTo(models.User)
    }

    get since(){
      return "Since " + this.createdAt.toISOString().slice(0,10)
    }

    static async searchName(name){
      const { Op } = require("sequelize");
      let search = {
        order : [['name']],
        where: {}
    }

    if (name) {
        search.where.name = { [Op.iLike] : `%${name}%`}
    }

    let foundName = await Profile.findAll(search)

    return foundName
    }
  }
  Profile.init({
    name: {
      type : DataTypes.STRING,
      allowNull : false,
      validate : {
        notNull : {
          msg : "Name can't be empty"
        },
        notEmpty : {
          msg : "Name can't be empty"
        }
      }
    },
    dateOfBirth: {
      type : DataTypes.DATE,
      allowNull : false,
      validate : {
        notNull : {
          msg : "Date of Birth can't be empty"
        },
        notEmpty : {
          msg : "Date of Birth can't be empty"
        },
        isDate: true
      }
    },
    gender: {
      type : DataTypes.STRING,
      allowNull : false,
      validate : {
        notNull : {
          msg : "Gender can't be empty"
        },
        notEmpty : {
          msg : "Gender can't be empty"
        }
      }
    },
    imgUrl: {
      type : DataTypes.STRING,
      defaultValue : "https://i0.wp.com/sbcf.fr/wp-content/uploads/2018/03/sbcf-default-avatar.png?ssl=1"
    },
    UserId: {
      type : DataTypes.INTEGER,
      allowNull : false,
      validate : {
        notNull : {
          msg : "UserId can't be empty"
        },
        notEmpty : {
          msg : "UserId can't be empty"
        }
      }
    },
  }, {
    sequelize,
    modelName: 'Profile',
  });
  return Profile;
};