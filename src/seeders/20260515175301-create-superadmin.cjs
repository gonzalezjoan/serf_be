'use strict';

module.exports = {
  async up (queryInterface, Sequelize) {
    // Aquí insertamos los datos
    await queryInterface.bulkInsert('Users', [{
      firstName: 'Admin',
      lastName: 'Sistema',
      email: 'sysadmin.jlfg.dev@gmail.com',
      phone: '+5800000000000',
      identityCard: 'V-00000000',
      role: 'sysadmin',
      password: '$2y$10$xBUE9Srp2WLUAIYykry79O5McDV4.6dtgYrl8XrgCldcRvhgrB0oS', // Contraseña hasheada (ejemplo)
      acceptTerms: true,
      createdAt: new Date(),
      updatedAt: new Date()
    }], {});
  },

  async down (queryInterface, Sequelize) {
    // Aquí definimos cómo borrar esos datos si queremos "limpiar"
    await queryInterface.bulkDelete('Users', { email: 'sysadmin.jlfg.dev@gmail.com' }, {});
  }
};