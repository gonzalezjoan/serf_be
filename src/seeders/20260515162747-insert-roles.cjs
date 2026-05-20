'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up (queryInterface, Sequelize) {
    await queryInterface.bulkInsert('Roles', [{
      roleName: 'sysadmin',
      description: 'Administrator of the system',
      createdAt: new Date(),
      updatedAt: new Date()
    }, {
      roleName: 'doctor',
      description: 'Medical professional using the system',
      createdAt: new Date(),
      updatedAt: new Date()
    }, {
      roleName: 'patient',
      description: 'Person using the system for medical services',
      createdAt: new Date(),
      updatedAt: new Date()
    }], {});
  },

  async down (queryInterface, Sequelize) {
    await queryInterface.bulkDelete('Roles', null, {});
  }
};