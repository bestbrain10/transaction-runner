require('dotenv').config()

const database = require('./database');
const server = require('./server');
const fs = require('fs');

console.log(
    fs.readFileSync('.env', { encoding: 'utf8' })
)
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

