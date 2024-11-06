const mysql = require('mysql2/promise')

const createConnection = async () => {
    const conn = await mysql.createConnection({
        port: 3306,
        host: 'localhost',
        user: 'root',
        password: '',
        database: 'agenda_consultorio'
    })
    return conn
}

module.exports = createConnection