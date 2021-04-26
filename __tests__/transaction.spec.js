require('dotenv').config();

const request = require('supertest');
const server = require('../server');
const database = require('../database');
const User = require('../models/user.model');
const Login = require('../models/login.model');
const { v4: uuid } = require('uuid');


describe('Transactions API', () => {
    describe('', () => {

    });
});