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
        references: {
          model: 'Users', // Nombre de la tabla destino
          key: 'id'       // Columna de la tabla destino
        },
        onUpdate: 'CASCADE', // Si el ID del usuario cambia, aquí también cambia
        onDelete: 'CASCADE'  // Si el usuario se borra, su perfil de doctor se borra automáticamente
      },
      doctorId: {
        type: Sequelize.INTEGER,
        allowNull: false,
        references: {
          model: 'DoctorProfiles', // Nombre de la tabla destino
          key: 'id'       // Columna de la tabla destino
        },
        onUpdate: 'CASCADE', // Si el ID del doctor cambia, aquí también cambia
        onDelete: 'CASCADE'  
      },
      treatmentId: {
        type: Sequelize.INTEGER,
        allowNull: false,
        references: {
          model: 'Treatment', // Nombre de la tabla destino
          key: 'id'       // Columna de la tabla destino
        },
        onUpdate: 'CASCADE', // Si el ID del usuario cambia, aquí también cambia
        onDelete: 'CASCADE'  // Si el usuario se borra, su perfil de doctor se borra automáticamente
      },
      createdAt: { allowNull: false, type: Sequelize.DATE },
      updatedAt: { allowNull: false, type: Sequelize.DATE }
    });
  },
  async down(queryInterface, Sequelize) {
    await queryInterface.dropTable('Appointment');
  }
};