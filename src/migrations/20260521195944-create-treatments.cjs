'use strict';
/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('Treatment', {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER
      },
      treatmentName: { type: Sequelize.STRING, allowNull: false },
      treatmentDescription: { type: Sequelize.STRING, allowNull: false },
      treatmentCost: { type: Sequelize.DECIMAL, allowNull: false },
      createdAt: { allowNull: false, type: Sequelize.DATE },
      updatedAt: { allowNull: false, type: Sequelize.DATE },
      
    });
  },
  async down(queryInterface, Sequelize) {
    await queryInterface.dropTable('Treatment');
  }
};
