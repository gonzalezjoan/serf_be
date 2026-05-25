'use strict';

'use strict';
/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    
    // 1. CREAMOS LA TABLA DE ESTADOS PRIMERO
    await queryInterface.createTable('AppointmentStatus', {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER
      },
      statusName: {
        type: Sequelize.STRING,
        allowNull: false,
        unique: true
      },
      createdAt: { allowNull: false, type: Sequelize.DATE },
      updatedAt: { allowNull: false, type: Sequelize.DATE }
    });
  },
  async down(queryInterface, Sequelize) {
    await queryInterface.dropTable('AppointmentStatus');
  }
};