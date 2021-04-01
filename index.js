require('dotenv').config()

const database = require('./database');
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

