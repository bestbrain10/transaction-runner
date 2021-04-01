
require('dotenv').config()

const request = require('supertest');
const server = require('../server');
const database = require('../database');

describe('Index Route', () => {
    let response;

    beforeAll(async () => {
        await database.authenticate();

        response = await request(server).get('/')
    });

    it('returns 200 status code', () => {
        expect(response.statusCode).toBe(200);
    });

    it('shows status API Online', () => {
        expect(response.body).toEqual({
            status: 'success', 
            data: {
                status: 'API Online'
            }
        });
    });
});