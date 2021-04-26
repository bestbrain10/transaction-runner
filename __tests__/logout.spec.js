require('dotenv').config();

const request = require('supertest');
const server = require('../server');
const database = require('../database');
const User = require('../models/user.model');
const Login = require('../models/login.model');
const { v4: uuid } = require('uuid');


describe('Logout API', () => {
	// does not wor without token
	// works
	// returns error if reused
	beforeAll(async () => {
		await database.authenticate();
	});

	afterAll(async () => {
		await database.close();
	});

	describe('Returns error without auth token', () => {
		let response;

		beforeAll(async () => {
			response = await request(server).put('/logout');
		});

		it('returns 401 status code', () => {
			expect(response.statusCode).toBe(401);
		});

		it('shows status API Online', () => {
			expect(response.body).toEqual({
				message: 'Unauthorized, provide access token',
				status: 'error'
			});
		});
	});

	describe('Logs out user', () => {
		let response;

		beforeAll(async () => {
			const email = `tony${uuid()}@avengers.com`;
			const password = 'password';
			await User.register({ email, password, fullname: 'Tony starks' });
			const user = await User.login({ email, password });
			const { token } = await Login.loginUser(user);
			response = await request(server).put('/logout').set('Authorization', `Bearer ${token}`);
		});

		it('returns 200 status code', () => {
			expect(response.statusCode).toBe(200);
		});

		it('shows success message', () => {
			expect(response.body).toEqual({
				data: true,
				status: 'success'
			});
		});
	});

	describe('Cannot logout user with the same token twice', () => {
		let response;

		beforeAll(async () => {
			const email = `tony${uuid()}@avengers.com`;
			const password = 'password';
			await User.register({ email, password, fullname: 'Tony starks' });
			const user = await User.login({ email, password });
			const { token } = await Login.loginUser(user);
			const loginID = Login.decodeLoginToken(token);
			await Login.logoutUser(loginID);
			response = await request(server).put('/logout').set('Authorization', `Bearer ${token}`);
		});

		it('returns 401 status code', () => {
			expect(response.statusCode).toBe(401);
		});

		it('shows error message', () => {
			expect(response.body).toEqual({
				message: 'Login session expired or does not exist',
				status: 'error'
			});
		});
	});
});