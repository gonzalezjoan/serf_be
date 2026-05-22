'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up (queryInterface, Sequelize) {
    await queryInterface.bulkInsert('Treatment', [{
      treatmentName: 'Ortodoncia Fija',
      treatmentDescription: 'Instalacion de ortodoncia con caso metalico',
      treatmentCost:60.99,
      createdAt: new Date(),
      updatedAt: new Date()
    },{
      treatmentName: 'Contol de Ortodoncia',
      treatmentDescription: 'Control para ortodoncia',
      treatmentCost:30.5,
      createdAt: new Date(),
      updatedAt: new Date()
    }], {});
  },

  async down (queryInterface, Sequelize) {
    await queryInterface.bulkDelete('Treatment', null, {});
  }
};