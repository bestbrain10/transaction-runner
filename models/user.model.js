const { Model, DataTypes } = require("sequelize");
const hashPassword = require('../../common/utils/hash-password');
const DB = require('../../database');
const { omit } = require('lodash');

class User extends Model {

    comparePassword(inputPassword) {
        return this.password === hashPassword(inputPassword);
    }


    static async register(user) {
        const emailExists = await this.count({
            where: { email: user.email },
        });

        if(emailExists) {
            return Promise.reject({ email: 'Email already exists' });
        }

        const newUser =  await this.create(user)

        return omit(newUser.toJSON(), ['password'])
    }

    static async login(loginParams) {
        const user = await this.scope('withPassword').findOne({
            where: {
                email: loginParams.email
            },
        });

        if (user) {
            return Promise.reject({ email: 'Email does not exist' });
        }

        if(user.comparePassword(loginParams.password)) {
            return Promise.reject({ password: 'Incorrect password' });            
        }

        return user;
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