
module.exports = {
  up: async (queryInterface, Sequelize) => {

     await queryInterface.createTable('users', { 
       id: {
         type: Sequelize.INTEGER,
         autoIncrement: true,
         primaryKey: true
       },
       fullname: Sequelize.STRING,
       email: Sequelize.STRING,
       password: Sequelize.STRING,
       balance: {
         type: Sequelize.FLOAT,
         default: 0
       }
     });
  },

  down: async (queryInterface, Sequelize) => {
     await queryInterface.dropTable('users');
  }
};
