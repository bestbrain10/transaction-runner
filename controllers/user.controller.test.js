require('dotenv').config()

const { mockNext, mockRequest, mockResponse } = require('../__mocks__/http');
const UserController = require('./user.controller');
const User = require('../models/user.model');
const UserTransaction = require('../models/transaction.model');



describe('User Controller', () => {
    describe('profile', () => {
        it('returns logged in user profile', async () => {
            const req = mockRequest({
                user: {
                    id: 6,
                    fullname: 'Thor Odinson'
                }
            });
            const res = mockResponse();

            const incomingSpy = jest.spyOn(UserTransaction, 'incomingTransactions').mockResolvedValueOnce([]);
            const outgoingSpy = jest.spyOn(UserTransaction, 'outgoingTransactions').mockResolvedValueOnce([]);

            await UserController.profile(req, res, mockNext)

            expect(res.data).toBeCalledWith({
                id: 6,
                fullname: 'Thor Odinson',
                incomingTransactions: [],
                outgoingTransactions: []
            });

            expect(incomingSpy).toBeCalledWith(6);
            expect(outgoingSpy).toBeCalledWith(6);
        });
    })

    describe('Find One User By ID', () => {
        it('It can find a user using query params', async () => {
            const req = mockRequest({
                params: {
                    user: 6,
                }
            });
            const res = mockResponse();

            const findSpy = jest.spyOn(User, 'findByPk').mockResolvedValueOnce({
                toJSON() {
                    return {
                        id: 6,
                        fullname: 'Thor Odinson'
                    }
                }
            });

            const incomingSpy = jest.spyOn(UserTransaction, 'incomingTransactions').mockResolvedValueOnce([]);
            const outgoingSpy = jest.spyOn(UserTransaction, 'outgoingTransactions').mockResolvedValueOnce([]);

            await UserController.getOneUser(req, res, mockNext)

            expect(res.data).toBeCalledWith({
                id: 6,
                fullname: 'Thor Odinson',
                incomingTransactions: [],
                outgoingTransactions: []
            });

            expect(findSpy).toBeCalledWith(6)

            expect(incomingSpy).toBeCalledWith(6);
            expect(outgoingSpy).toBeCalledWith(6);
        });
    });

    describe('Get All User', () => {
        it('Fetches all users using default Pagination', async () => {
            const req = mockRequest();
            const res = mockResponse();

            const findSpy = jest.spyOn(User, 'findAll').mockResolvedValueOnce([
                {id: 1},
                {id: 2},
            ]);

            await UserController.getAllUsers(req, res, mockNext)

            expect(res.data).toBeCalledWith([
                {id: 1},
                {id: 2},
            ]);

            expect(findSpy).toBeCalledWith({
                limit: 30,
                offset: 0
            });
        });

        it('Fetches all users using input Pagination', async () => {
            const req = mockRequest({
                query: {
                    skip: 3,
                    limit: 60
                }
            });
            const res = mockResponse();

            const findSpy = jest.spyOn(User, 'findAll').mockResolvedValueOnce([
                {id: 1},
                {id: 2},
            ]);

            await UserController.getAllUsers(req, res, mockNext)

            expect(res.data).toBeCalledWith([
                {id: 1},
                {id: 2},
            ]);

            expect(findSpy).toBeCalledWith({
                limit: 60,
                offset: 3
            });
        });
    })
});


