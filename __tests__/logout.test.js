require('dotenv').config()

const request = require('supertest');
const server = require('../server');
const database = require('../database');
const User = require('../models/user.model');
const Login = require('../models/login.model');


describe('Logout API', () => {
    // does not wor without token
    // works
    // returns error if reused
    beforeAll(async () => {
        await database.authenticate();
    });

    afterAll(async () => {
        await database.close();
    })

    describe('Returns error without auth token', () => {
        let response;

        beforeAll(async () => {
            response = await request(server).put('/logout')
        });

        

        it('returns 401 status code', () => {
            expect(response.statusCode).toBe(401);
        });

        it('shows status API Online', () => {
            expect(response.body).toEqual({
                status: 'success',
                data: {
                    status: 'API Online'
                }
            });
        });
    })
});