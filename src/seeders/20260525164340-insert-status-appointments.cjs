'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up (queryInterface, Sequelize) {
    await queryInterface.bulkInsert('AppointmentStatus', [
      { id: 1, statusName: 'pending', createdAt: new Date(), updatedAt: new Date() },
      { id: 2, statusName: 'approved', createdAt: new Date(), updatedAt: new Date() },
      { id: 3, statusName: 'moved', createdAt: new Date(), updatedAt: new Date() }
    ], {});
  },

  async down (queryInterface, Sequelize) {
    await queryInterface.bulkDelete('AppointmentStatus', null, {});
  }
};
