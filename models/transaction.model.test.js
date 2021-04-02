

const UserTransaction = require('./transaction.model');
const User = require('./user.model');


describe('Transaction Model', () => {

    describe('Debit', () => {
        it('create a debit transaction record', async () => {
            const amount = 10
            const sender = 34;
            const receiver = 1;
            const transaction = {};

            const createSpy = jest.spyOn(UserTransaction, 'create');
            createSpy.mockResolvedValueOnce({ id: 10, sender, amount, receiver });

            const result = await UserTransaction.debit({ receiver, amount, sender }, transaction);

            expect(result).toMatchObject({ id: 10, sender, amount, receiver });
            expect(createSpy).toBeCalledWith({
                sender,
                receiver,
                amount,
                txType: 'DEBIT'
            }, {
                transaction
            });
        });
    });

    describe('Credit', () => {
        it('create a credit transaction record', async () => {
            const amount = 10
            const sender = 34;
            const receiver = 1;
            const transaction = {};

            const createSpy = jest.spyOn(UserTransaction, 'create');
            createSpy.mockResolvedValueOnce({
                id: 10,
                sender,
                amount,
                receiver
            });

            const result = await UserTransaction.credit({
                receiver,
                amount,
                sender
            }, transaction);

            expect(result).toMatchObject({
                id: 10,
                sender,
                amount,
                receiver
            });
            expect(createSpy).toBeCalledWith({
                sender,
                receiver,
                amount,
                txType: 'CREDIT'
            }, {
                transaction
            });
        });
    });


    describe('Deposit Callback', () => {
        it('Adds amount to user global balance and creates new entry', async () => {
            const user = 10;
            const amount = 50;
            const transaction = {};

            const modifySpy = jest.spyOn(User, 'modifyBalance').mockResolvedValueOnce(true);
            const creditSpy = jest.spyOn(UserTransaction, 'credit').mockResolvedValueOnce(true);

            const result = await UserTransaction.depositCallback(user, amount, transaction)

            expect(result).toBe(true);
            expect(modifySpy).toBeCalledWith(user, amount, transaction);
            expect(creditSpy).toBeCalledWith({
                receiver: user,
                amount
            }, transaction)
        });
    });


    describe('Incoming Transactions', () => {
        it('Finds all incoming transaction for user', async () => {
            const findSpy = jest.spyOn(UserTransaction, 'findAll');
            findSpy.mockResolvedValueOnce([{ id: 1 }]);

            const result = await UserTransaction.incomingTransactions(1);

            expect(result).toEqual([{ id: 1 }]);
            expect(findSpy).toBeCalledWith({
                where: {
                    receiver: 1,
                    txType: 'CREDIT'
                },
                limit: 100
            });
        });
    })

    describe('Outgoing Transactions', () => {
        it('Finds all outgoing transaction for user', async () => {
            const findSpy = jest.spyOn(UserTransaction, 'findAll');
            findSpy.mockResolvedValueOnce([{
                id: 1
            }]);

            const result = await UserTransaction.outgoingTransactions(1);

            expect(result).toEqual([{
                id: 1
            }]);
            expect(findSpy).toBeCalledWith({
                where: {
                    sender: 1,
                    txType: 'DEBIT'
                },
                limit: 100
            });
        });
    });

    describe('Transfer Callback', () => {
       it('Modifies users balance and logs the transaction', async () => {
            const modifySpy = jest.spyOn(User, 'modifyBalance').mockResolvedValue(true);

            const logSpy = jest.spyOn(UserTransaction, 'logTransfer').mockResolvedValue(true);
            const from = 1;
            const to = 2;
            const amount= 50000;
            const transaction = {};

            const result = await UserTransaction.transferCallback({
                from, to , amount
            }, transaction);

            expect(result).toBe(true);
            expect(logSpy).toBeCalledWith({
                from,
                to,
                amount
            }, transaction);

            expect(modifySpy.mock.calls).toEqual([
                [from, -1 * amount, transaction],
                [to, amount, transaction]
            ])

       }) 
    });


    describe('Log Transfer', () => {
        it('Credits Receiver and debits sender', async () => {
            const creditSpy = jest.spyOn(UserTransaction, 'credit').mockResolvedValue(true);

            const debitSpy = jest.spyOn(UserTransaction, 'debit').mockResolvedValue(true);
            const from = 1;
            const to = 2;
            const amount = 50000;
            const transaction = {};

            const result = await UserTransaction.logTransfer({
                from,
                to,
                amount
            }, transaction);

            expect(result).toBe(true);

            expect(creditSpy).toBeCalledWith({
                sender: from,
                receiver: to,
                amount
            }, transaction);

            expect(debitSpy).toBeCalledWith({
                sender: from,
                receiver: to,
                amount
            }, transaction)
        })
    });
});
