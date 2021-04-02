require('dotenv').config()

const database = require('./database');

if(require.main === module) {
// if called from CLI activate server
    const server = require('./server');
    database.authenticate()
    .then(() => {
        server.listen(process.env.PORT, () => {
            console.log(`Application Started on port ${process.env.PORT}`);
        })
    })
    .catch(e => {
        console.log('Database connection failed');
        console.log(e)
    })
} else {
    // export SDK methods

    module.exports = {
        User: require('./models/user.model'),
        Login: require('./models/login.model'),
        UserTransaction: require('./models/transaction.model'),
        databaseInit: () => database.authenticate(),
        databaseClose: () => database.close()
    }
}
