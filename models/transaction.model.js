const { Model, DataTypes } = require("sequelize");
const DB = require('../database');
const User = require('./user.model');

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
     * @param {object} transferDetails 
     * @param {object} transaction 
     * @returns 
     */
    static async logTransfer(transferDetails, transaction) {
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

    /**
     * Deposit session callback
     * @param {number} user 
     * @param {number} amount 
     * @param {object} transaction 
     * @returns 
     */
    static async depositCallback(user, amount, transaction) {
            await User.modifyBalance(user, amount, transaction);
            await this.credit({
                receiver: user,
                amount
            }, transaction);

            return true;
    }

    /**
     * Deposits amount into user wallet balance
     * @param {number} user 
     * @param {number} amount 
     * @returns {boolean}
     */
    static async deposit(user, amount) {
        try {
            return DB.transaction(transaction => this.depositCallback(user, amount, transaction));
        }catch(e) {
            return Promise.reject('Could not complete transaction');
        }
    }

    /**
     * Callback for transfer transaction session
     * @param {object} transferDetails 
     * @param {object} transaction 
     * @returns 
     */
    static async transferCallback(transferDetails, transaction) {
        const { from, to, amount } = transferDetails;
        await User.modifyBalance(from, -1 * amount, transaction);
        await User.modifyBalance(to, amount, transaction);
        await this.logTransfer(transferDetails, transaction);

        return true;
    }

    /**
     * Transfers fund from one user to another
     * @param {object} transferDetails
     * @returns {boolean}
     */
    static async transfer(transferDetails) {
        try {
            return DB.transaction(transaction => this.transferCallback(transferDetails, transaction));
        } catch (e) {
            return Promise.reject('Could not complete transaction');
        }
    }

    /**
     * 
     * @param {number} userID 
     */
    static incomingTransactions(userID) {
        return this.findAll({
            where: {
                receiver: userID,
                txType: 'CREDIT'
            },
            limit: 100
        })
    }

    /**
     * 
     * @param {number} userID 
     */
    static outgoingTransactions(userID) {
        return this.findAll({
            where: {
                sender: userID,
                txType: 'DEBIT'
            },
            limit: 100
        })
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
    tableName: 'transactions',
    underscored: true,
    timestamps: true,
    sequelize: DB
});

module.exports = UserTransaction;