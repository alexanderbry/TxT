'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up (queryInterface, Sequelize) {
    let post = require("../data/post.json").map(el => {
      delete el.id
      el.createdAt = el.updatedAt = new Date()
  
      return el
     })
    await queryInterface.bulkInsert('Posts', post, {})
  },

  async down (queryInterface, Sequelize) {
    await queryInterface.bulkDelete('Posts', null, {});
  }
};
