// grabbing the client by destructuring it from the export inside /db/index.js
const { client, getAllUsers, createUser } = require('./index');


//a function that calls a query which drops all tables from the database
const dropTables = async () => {
	try{
		console.log('starting to drop tables...');
	
		await client.query(`DROP TABLE IF EXISTS users;`);
		console.log('finished dropping tables!');
	}
	catch(error){
		console.error('error dropping tables!');
		throw error;
	}
};

//a function that calls a query which creates all tables for the database
const createTables = async () => {
	try{
		console.log('starting to build tables...');
	
		await client.query (`
			CREATE TABLE users (
				id SERIAL PRIMARY KEY,
				username varchar(255) UNIQUE NOT NULL,
				password varchar(255) NOT NULL
			);
		`);
		
		console.log('Finished building tables!');
	}
	catch(error){
		console.error('Error building tables!');
		throw error;
	}
};

//a function that attempts to create a few users
const createInitialUsers = async () => {
	try{
		console.log('Starting to create users...');
		
		const albert = await createUser({ username: 'albert', password: 'bertie99' });
		const sandra = await createUser({ username: 'sandra', password: '2sandy4me' });
		const glamgal = await createUser({ username: 'glamgal', password: 'soglam' });
		
		console.log(albert);
		
		console.log('finished creating users!');
	}
	catch(error){
		console.error('Error creating users!');
		throw error;
	}
};

//a function that connects to the client, calls drop tables and then create tables, 
//then ends the connection to the client.
const rebuildDB = async () => {
	try{
		client.connect();
		
		await dropTables();
		await createTables();
		await createInitialUsers();
	}
	catch(error){
		throw error;
	}
};

//a function that connects the client to the database, queries the db for all results from users,
//console logs the results, and finally closes the client connection
const testDB = async () => {
	try{
		console.log("Starting to test database...");
		const users = await getAllUsers();
		
		console.log("getAllUsers:", users);
		
		console.log("Finished database tests!");
	}
	catch (error) {
		console.error("Error testing database!");
		throw error;
	}
};

//bootstrap
rebuildDB()
	.then(testDB)
	.catch(console.error)
	.finally(()=> client.end());
