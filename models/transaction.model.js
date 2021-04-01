const { Model, DataTypes } = require("sequelize");
const DB = require('../database');
const { omit } = require('lodash');

class UserTransaction extends Model {

    /**
     * 
     * @param {sender, receiver, amount} userTransaction 
     * @param {Transaction} databaseTransaction 
     * @returns 
     */
    static async debit(userTransaction, databaseTransaction) {
        const { sender, receiver, amount } = userTransaction;
        return this.create({
            sender,
            receiver,
            amount,
            txType: 'DEBIT'
        }, {
            transaction: databaseTransaction
        });
    }

    /**
     * 
     * @param {sender, receiver, amount} userTransaction 
     * @param {Transaction} databaseTransaction 
     * @returns 
     */
    static async credit(userTransaction, databaseTransaction) {
        const { sender, receiver, amount } = userTransaction;
        return this.create({
            sender,
            receiver,
            amount,
            txType: 'CREDIT'
        }, {
            transaction: databaseTransaction
        });
    }

    /**
     * 
     * @param {from, to, amount} transferDetails 
     * @param {Transaction} transaction 
     * @returns 
     */
    static async transfer(transferDetails, transaction) {
        const { from, to, amount } = transferDetails;
        await this.credit({
            sender: from,
            receiver: to,
            amount
        }, transaction);

        await this.debit({
            sender: from,
            receiver: to,
            amount
        }, transaction);

        return true
    }
}

UserTransaction.init({
    id: {
        type: DataTypes.INTEGER,
        autoIncrement: true,
        primaryKey: true
    },
    sender: DataTypes.INTEGER,
    receiver: DataTypes.INTEGER,
    txType: {
        type: DataTypes.ENUM,
        values: [
            'DEBIT',
            'CREDIT',
        ]
    },
    amount: DataTypes.FLOAT,
}, {
    tableName: 'user_transactions',
    underscored: true,
    timestamps: true,
    sequelize: DB
});

module.exports = UserTransaction;