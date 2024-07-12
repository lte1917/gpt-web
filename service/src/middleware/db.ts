import mysql from 'mysql';

const connection = mysql.createConnection({
    host: '8.134.76.3',
    user: 'root',
    password: 'ayyh8ztLNMhhRALX',
    database: 'chatgpt',
    waitForConnections: true,
    connectionLimit: 10,
    queueLimit: 0
});
connection.connect((err) => {
    if (err) {
        console.error('Error connecting to database: ' + err.stack);
        return;
    }
    console.log('Connected to database as id ' + connection.threadId);
});

export { connection };