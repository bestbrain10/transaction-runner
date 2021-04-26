require('dotenv').config();

const request = require('supertest');
const server = require('../server');
const userSeeder = require('../__mocks__/user');
const database = require('../database');
const { v4: uuid } = require('uuid');
const email = `bruce${uuid()}@avengers.com`;
const _ = require('lodash');

describe('User API', () => {
	let token;
	beforeAll(async () => {
		await database.authenticate();
		const user = await userSeeder({ 
			email,
			fullname: 'Bruce Banners'
		});
		token = user.token;
	});

	afterAll(async () => {
		await database.close();
	});

	describe('Can view User Profile', () => {
		let response;
		beforeAll(async () => {
			response = await request(server).get('/users/profile').set('Authorization', `Bearer ${token}`);
		});

		it('returns 200 status code', () => {
			expect(response.status).toBe(200);
		});

		it('returns user profile', () => {
			expect(Object.keys(response.body.data).sort())
				.toEqual(['balance', 'email', 'fullname', 'id', 'createdAt', 'updatedAt', 'incomingTransactions', 'outgoingTransactions'].sort());
		});
	});

	describe('Can view a User By ID', () => {
		let response;
		beforeAll(async () => {
			const { id } = await userSeeder();
			response = await request(server).get(`/users/${id}`).set('Authorization', `Bearer ${token}`);
		});

		it('returns 200 status code', () => {
			expect(response.status).toBe(200);
		});

		it('returns user profile', () => {
			expect(Object.keys(response.body.data).sort())
				.toEqual(['balance', 'email', 'fullname', 'id', 'createdAt', 'updatedAt', 'incomingTransactions', 'outgoingTransactions'].sort());
		});
	});

	describe('Can fetch multiple users', () => {
		let response;
		beforeAll(async () => {
			response = await request(server).get('/users').set('Authorization', `Bearer ${token}`);
		});

		it('returns 200 status code', () => {
			expect(response.status).toBe(200);
		});

		it('returns user profile', () => {
			expect(response.body.data).toBeInstanceOf(Array);
			const expectedKeys = ['balance', 'email', 'fullname', 'id', 'createdAt', 'updatedAt', 'incomingTransactions', 'outgoingTransactions'].sort();
			expect(response.body.data.every(user => {
				return !_.difference(Object.keys(user).sort(), expectedKeys).length;
			}))
				.toEqual(true);
		});
	});
});