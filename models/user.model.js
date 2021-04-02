const { Model, DataTypes, Sequelize } = require("sequelize");
const hashPassword = require('../common/utils/hash-password');
const DB = require('../database');
const { omit } = require('lodash');

class User extends Model {

    /**
     * compares input password with stored hash
     * @param {string} inputPassword 
     * @returns 
     */
    comparePassword(inputPassword) {
        return this.password === hashPassword(inputPassword);
    }


    /**
     * Registers a new user, makes sure email is unique
     * @param {object} user 
     * @returns 
     */
    static async register(user) {
        const emailExists = await this.count({
            where: { email: user.email },
        });

        if(emailExists) {
            return Promise.reject({ email: 'Email already exists' });
        }

        const newUser =  await this.create({
            ...user,
            balance: 0
        });

        return omit(newUser.toJSON(), ['password']);
    }

    /**
     * Logs in a user, checks for password and email correctness
     * @param {object} loginParams 
     * @returns 
     */
    static async login(loginParams) {
        const user = await this.scope('withPassword').findOne({
            where: {
                email: loginParams.email
            },
        });

        if (!user) {
            return Promise.reject({ email: 'Email does not exist' });
        }

        if(!user.comparePassword(loginParams.password)) {
            return Promise.reject({ password: 'Incorrect password' });            
        }

        return omit(user.toJSON(), ['password']);
    }

    /**
     * Increments or decrement user's account by amount
     * @param {number} user 
     * @param {number} amount 
     * @param {Transaction} transaction
     * @returns 
     */
    static async modifyBalance(user, amount, transaction) {
        const [ count ] = await this.update({
            balance: Sequelize.literal(`balance + ${amount}`)
        }, {
            where: { id: user },
            transaction
        });

        if(!count) {
            return Promise.reject('Could not complete transaction');
        }

        return true;
    }
}

User.init({
        id: {
            type: DataTypes.INTEGER,
            autoIncrement: true,
            primaryKey: true
        },
        fullname: DataTypes.STRING,
        email: DataTypes.STRING,
        password: DataTypes.STRING,
        balance: {
            type: DataTypes.FLOAT,
            default: 0
        }
    }, {
        tableName: 'users',
        underscored: true,
        timestamps: true,
        defaultScope: {
            attributes: { exclude: ['password'] }
        },
        scopes: { 
            withPassword: { attributes: {} }
         },
        sequelize: DB
});

User.beforeCreate((user, options) => {
    user.password = hashPassword(user.password);
});

module.exports = User;