'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up (queryInterface, Sequelize) {
    await queryInterface.bulkInsert('Treatment', [{
      treatmentName: 'Ortodoncia Fija',
      description: 'Instalacion de ortodoncia con caso metalico',
      createdAt: new Date(),
      updatedAt: new Date()
    }], {});
  },

  async down (queryInterface, Sequelize) {
    await queryInterface.bulkDelete('Treatment', null, {});
  }
};