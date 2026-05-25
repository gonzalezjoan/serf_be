'use strict';
/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    // Cambiamos el nombre de la tabla a 'DoctorProfiles' para que sea más descriptivo
    await queryInterface.createTable('Appointment', {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER
      },
      userId: {
        type: Sequelize.INTEGER,
        allowNull: false,
        references: { model: 'Users', key: 'id' },
        onUpdate: 'CASCADE',
        onDelete: 'CASCADE'
      },
      doctorId: {
        type: Sequelize.INTEGER,
        allowNull: false,
        references: { model: 'DoctorProfiles', key: 'id' },
        onUpdate: 'CASCADE',
        onDelete: 'CASCADE'  
      },
      treatmentId: {
        type: Sequelize.INTEGER,
        allowNull: false,
        references: { model: 'Treatment', key: 'id' }, // Ajustado al modelo singular físico de Postgres
        onUpdate: 'CASCADE',
        onDelete: 'CASCADE'
      },
      appointmentDate: {
        type: Sequelize.DATE,
        allowNull: false
      },
      statusId: {
        type: Sequelize.INTEGER,
        allowNull: false,
        references: { 
          model: 'AppointmentStatus',
          key: 'id' 
        },
        onUpdate: 'CASCADE',
        onDelete: 'RESTRICT'
      },
      createdAt: { allowNull: false, type: Sequelize.DATE },
      updatedAt: { allowNull: false, type: Sequelize.DATE }
    });
  },
  async down(queryInterface, Sequelize) {
    await queryInterface.dropTable('Appointment');
  }
};