require('dotenv').config();

const { mockNext, mockRequest, mockResponse } = require('../__mocks__/http');
const TransactionController = require('./transaction.controller');
const UserTransaction = require('../models/transaction.model');


describe('Transaction Controller', () => {
	describe('balanceCheck', () => {
		it('returns error if user balance is less than specified amount', async () => {
			const req = mockRequest({
				user: { balance: 6 },
				body: { amount: 10 }
			});
			const res = mockResponse();
			await TransactionController.balanceCheck(req, res, mockNext);
			expect(res.status).toBeCalledWith(400);
			expect(res.error).toBeCalledWith({
				amount: 'Insufficient balance for transaction'
			});
		});

		it('moves to next route if balance is greater than or equal to amount', async () => {
			const req = mockRequest({
				user: { balance: 10 },
				body: { amount: 6 }
			});
			const res = mockResponse();
			const next = jest.fn();
			await TransactionController.balanceCheck(req, res, next);
			expect(next).toBeCalled();
		});
	});

	describe('Transfer', () => {
		it('can transfer using userID in request token', async () => {
			const req = mockRequest({
				user: { id: 10 },
				body: { amount: 6, user: 15 }
			});
			const res = mockResponse();
			const next = jest.fn();
			const transferSpy = jest.spyOn(UserTransaction, 'transfer').mockResolvedValueOnce(true);
            
			await TransactionController.transfer(req, res, next);

			expect(transferSpy).toBeCalledWith({
				from: 10,
				to: 15,
				amount: 6
			});
		});
	});

	describe('Deposit', () => {
		it('can deposit to userID in request token', async () => {
			const req = mockRequest({
				user: { id: 10 },
				body: { amount: 6, }
			});
			const res = mockResponse();
			const next = jest.fn();
			const transferSpy = jest.spyOn(UserTransaction, 'deposit').mockResolvedValueOnce(true);

			await TransactionController.deposit(req, res, next);

			expect(transferSpy).toBeCalledWith(
				10,
				6
			);
		});
	});
});