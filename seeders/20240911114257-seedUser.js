'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up (queryInterface, Sequelize) {
   let user = require("../data/user.json").map(el => {
    delete el.id
    el.createdAt = el.updatedAt = new Date()
    el.role = "user"

    return el
   })
   await queryInterface.bulkInsert('Users', user, {})
  },

  async down (queryInterface, Sequelize) {
    await queryInterface.bulkDelete('Users', null, {})
  }
};
