'use strict';
/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('Users', {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER
      },
      firstName: { type: Sequelize.STRING, allowNull: false },
      lastName: { type: Sequelize.STRING, allowNull: false },
      email: { type: Sequelize.STRING, allowNull: false, unique: true },
      phone: { type: Sequelize.STRING, allowNull: false },
      identityCard: { type: Sequelize.STRING, allowNull: false, unique: true },
      password: { type: Sequelize.STRING, allowNull: false }, 
      acceptTerms: { type: Sequelize.BOOLEAN, allowNull: false },
      // CAMBIO CENTRAL: Ahora es una clave foránea nativa que apunta a la tabla Roles
      roleId: { 
        type: Sequelize.INTEGER, 
        allowNull: false, 
        defaultValue: 3, // Por defecto apunta al ID 3 ('patient')
        references: {
          model: 'Roles', // Nombre de la tabla física en la base de datos
          key: 'id'       // Columna de destino
        },
        onUpdate: 'CASCADE',
        onDelete: 'RESTRICT' // Seguridad: No permite borrar un rol si tiene usuarios activos
      },
      createdAt: { allowNull: false, type: Sequelize.DATE },
      updatedAt: { allowNull: false, type: Sequelize.DATE }
    });
  },
  async down(queryInterface, Sequelize) {
    await queryInterface.dropTable('Users');
  }
};