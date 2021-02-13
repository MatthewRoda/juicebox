//importing the Client functionality from postgres
const { Client } = require('pg');

//declaring a client variable, assigned to the result of running the Client method with a path string containing the name and location of the db
const client = new Client('postgres://localhost:5432/juicebox-dev');



const getAllUsers = async () => {
	const { rows } = await client.query(`SELECT id, username FROM users;`);
	
	return rows;
};

const createUser = async ({ username, password }) => {
	try{
		const { rows } = await client.query(`
			INSERT INTO users(username, password) 
			VALUES ($1, $2)
			ON CONFLICT (username) DO NOTHING
			RETURNING *;
		`, [username, password]);
		
		return rows;
	}
	catch(error) {
		throw error;
	}
};


module.exports = {
	client,
	getAllUsers,
	createUser,
};
