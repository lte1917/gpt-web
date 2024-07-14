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

export { pool };
