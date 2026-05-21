'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up (queryInterface, Sequelize) {
    await queryInterface.bulkInsert('Inventary', [{
      itemName: 'Caso de Ortodoncia',
      itemUseDescription: 'Caso metalico para instalacion de ortodoncia',
      itemCost:'9.99',
      itemQuantity: '10',
      createdAt: new Date(),
      updatedAt: new Date()
    },{
      itemName: 'Arco 0.14 Nitil',
      itemUseDescription: 'Arco para ortodoncia',
      itemCost:'5.99',
      itemQuantity: '10',
      createdAt: new Date(),
      updatedAt: new Date()
    }], {});
  },
//archwires
  async down (queryInterface, Sequelize) {
    await queryInterface.bulkDelete('Inventary', null, {});
  }
};