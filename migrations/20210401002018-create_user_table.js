
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
			},
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
		await queryInterface.dropTable('users');
	}
};
