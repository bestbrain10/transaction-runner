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
				type: Sequelize.ENUM,
				values: [
					'DEBIT',
					'CREDIT',
				]
			},
			amount: Sequelize.FLOAT,
			created_at: {
				type: 'TIMESTAMP',
				defaultValue: Sequelize.literal('CURRENT_TIMESTAMP'),
				allowNull: false
			},
			updated_at: {
				type: 'TIMESTAMP',
				defaultValue: Sequelize.literal('CURRENT_TIMESTAMP'),
				onUpdate: true,
				allowNull: false
			}
		});
	},

	// eslint-disable-next-line no-unused-vars
	down: async (queryInterface, Sequelize) => {
		await queryInterface.dropTable('transactions');
	}
};
