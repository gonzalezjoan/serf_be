'use strict';
/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    // Cambiamos el nombre de la tabla a 'DoctorProfiles' para que sea más descriptivo
    await queryInterface.createTable('DoctorProfiles', {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER
      },
      doctorCode: { 
        type: Sequelize.INTEGER, 
        allowNull: false, 
        unique: true 
      },
      // ESTA ES LA LLAVE FORÁNEA: Conecta este perfil con un ID de la tabla Users
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
      createdAt: { allowNull: false, type: Sequelize.DATE },
      updatedAt: { allowNull: false, type: Sequelize.DATE }
    });
  },
  async down(queryInterface, Sequelize) {
    await queryInterface.dropTable('DoctorProfiles');
  }
};