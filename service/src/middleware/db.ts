import mysql from 'mysql';

const pool = mysql.createPool({
		waitForConnections: true,
		host: '8.134.76.3',
		user: 'root',
		password: 'ayyh8ztLNMhhRALX',
		database: 'chatgpt',
		connectionLimit: 100,
		queueLimit: 0,
	reconnect: true
});

setInterval(() => {
//check connection
	pool.getConnection((err, connection) => {
		if (err) {
			if (err.code === 'PROTOCOL_CONNECTION_LOST') {
				console.error('Database connection was closed.');
			}
			if (err.code === 'ER_CON_COUNT_ERROR') {
				console.error('Database has too many connections.');
			}
			if (err.code === 'ECONNREFUSED') {
				console.error('Database connection was refused.');
			}
		}
		if (connection) connection.release();
		return;
	});
}, 1000);

export { pool };
