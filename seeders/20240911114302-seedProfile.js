'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up (queryInterface, Sequelize) {
    let profile = require("../data/profile.json").map(el => {
      delete el.id
      el.createdAt = el.updatedAt = new Date()

      return el
     })
     await queryInterface.bulkInsert('Profiles', profile, {})
  },

  async down (queryInterface, Sequelize) {
    await queryInterface.bulkDelete('Users', null, {})
  }
};
