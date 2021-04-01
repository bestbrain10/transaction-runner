module.exports = {
  up: async (queryInterface, Sequelize) => {

    await queryInterface.createTable('transactions', {
      id: {
        type: Sequelize.INTEGER,
        autoIncrement: true,
        primaryKey: true
      },
      sender: Sequelize.INTEGER,
      receiver: Sequelize.INTEGER,
      tx_type: {
        type: DataTypes.ENUM,
        values: [
          'DEBIT',
          'CREDIT',
        ]
      },
      amount: Sequelize.FLOAT
    });
  },

  down: async (queryInterface, Sequelize) => {
    await queryInterface.dropTable('transactions');
  }
};
