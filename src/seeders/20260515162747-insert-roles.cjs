'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up (queryInterface, Sequelize) {
    await queryInterface.bulkInsert('Roles', [{
      name: 'sysadmin',
      description: 'Administrator of the system'
    }, {
      name: 'doctor',
      description: 'Medical professional using the system'
    },{
      name: 'patient',
      description: 'Person using the system for medical services'
    }], {});
  },

  async down (queryInterface, Sequelize) {
    await queryInterface.bulkDelete('Roles', null, {});
  }
};
