require('dotenv').config();

const request = require('supertest');
const server = require('../server');
const userSeeder = require('../__mocks__/user');
const User = require('../models/user.model');
const database = require('../database');


describe('Transactions API', () => {
	// can deposit
	// can transfer
	// can't transfer with insufficient balance
	let token;
	let id;
	beforeAll(async () => {
		await database.authenticate();
		const user = await userSeeder();
		token = user.token;
		id = user.id;
	});

	afterAll(async () => {
		await database.close();
	});

	describe('Deposit without payload returns error', () => {
		let response;
		beforeAll(async () => {
			response = await request(server).post('/transactions/deposit').set('Authorization', `Bearer ${token}`);
		});

		it('returns a 400 status code', () => {
			expect(response.status).toBe(400);
		});

		it('returns error message', () => {
			expect(response.body).toMatchObject({
				error: {
					amount: 'amount is required',
				},
				message: 'An error occured',
				status: 'error',
			});
		});
	});

	describe('Deposit with valid payload succeeds', () => {
		let response;
		beforeAll(async () => {
			response = await request(server)
				.post('/transactions/deposit')
				.send({ amount: 4000 })
				.set('Authorization', `Bearer ${token}`);
		});

		it('returns a 200 status code', () => {
			expect(response.status).toBe(200);
		});

		it('returns success message', () => {
			expect(response.body).toMatchObject({
				status: 'success',
			});
		});
	});

	describe('Transfer without payload throws error', () => {
		let response;
		beforeAll(async () => {
			response = await request(server)
				.post('/transactions/transfer')
				.set('Authorization', `Bearer ${token}`);
		});

		it('returns a 400 status code', () => {
			expect(response.status).toBe(400);
		});

		it('returns error message', () => {
			expect(response.body).toMatchObject({
				error:  {
					amount: 'amount is required',
					user: 'user is required',
				},
				message: 'An error occured',
				status: 'error'
			});
		});
	});

	describe('Transfer with insufficient balance throws error', () => {
		let response;
		beforeAll(async () => {
			response = await request(server)
				.post('/transactions/transfer')
				.send({
					user: 12121212,
					amount: 6000
				})
				.set('Authorization', `Bearer ${token}`);
		});

		it('returns a 400 status code', () => {
			expect(response.status).toBe(400);
		});

		it('returns error message', () => {
			expect(response.body).toMatchObject({
				error: {
					amount: 'Insufficient balance for transaction',
				},
				message: 'An error occured',
				status: 'error'
			});
		});
	});

	describe('Transfer with non-existing receiver throws error', () => {
		let response;
		beforeAll(async () => {
			response = await request(server)
				.post('/transactions/transfer')
				.send({
					user: 12121212,
					amount: 400
				})
				.set('Authorization', `Bearer ${token}`);
		});

		it('returns a 400 status code', () => {
			expect(response.status).toBe(400);
		});

		it('returns error message', () => {
			expect(response.body).toMatchObject({
				message: 'Could not complete transaction',
				status: 'error'
			});
		});
	});

	describe('Transfer with existing receiver succeeds', () => {
		let response;
		let otherUser;
		beforeAll(async () => {
			otherUser = await userSeeder();
			response = await request(server)
				.post('/transactions/transfer')
				.send({
					user: otherUser.id,
					amount: 400
				})
				.set('Authorization', `Bearer ${token}`);
		});

		it('returns a 200 status code', () => {
			expect(response.status).toBe(200);
		});

		it('returns success message', () => {
			expect(response.body).toMatchObject({
				data: true,
				status: 'success'
			});
		});

		it('balance of both users are correct', async () => {
			const { balance: userBalance } = await User.findByPk(id);
			const { balance: friendBalance } = await User.findByPk(otherUser.id);

			expect(userBalance).toBe(3600);
			expect(friendBalance).toBe(400);
		});
	});
});