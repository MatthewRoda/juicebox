// grabbing the client by destructuring it from the export inside /db/index.js
const {
	client, 
	createUser, 
	updateUser, 
	getAllUsers, 
	getUserById,
	createPost, 
	updatePost,
	getAllPosts, 
	getAllTags,
	getPostsByTagName
	} = require('./index');


//a function that calls a query which drops all tables from the database
const dropTables = async () => {
	try{
		console.log('starting to drop tables...');
		await client.query(`
		DROP TABLE IF EXISTS post_tags;
		DROP TABLE IF EXISTS tags;
		DROP TABLE IF EXISTS posts;
		DROP TABLE IF EXISTS users;
		`);
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
				password varchar(255) NOT NULL,
				name varchar(255) NOT NULL,
				location varchar(255) NOT NULL,
				active BOOLEAN DEFAULT true
			);
		
			CREATE TABLE posts(
				id SERIAL PRIMARY KEY,
				"authorId" INTEGER REFERENCES users(id),
				title varchar(255) NOT NULL,
				content TEXT NOT NULL,
				active BOOLEAN DEFAULT true
			);
			
			CREATE TABLE tags (
				id SERIAL PRIMARY KEY,
				name varchar(255) UNIQUE NOT NULL
			);
			
			CREATE TABLE post_tags(
				"postId" INTEGER REFERENCES posts(id),
				"tagId" INTEGER REFERENCES tags(id),
				UNIQUE ("postId", "tagId")
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
		
		await createUser({
			username: 'albert', 
			password: 'bertie99', 
			name: 'Al Bert', 
			location: 'Texas' 
		});
		await createUser({ 
			username: 'sandra', 
			password: '2sandy4me', 
			name: 'Sandy Sandra', 
			location: 'Not Texas' 
		});
		await createUser({ 
			username: 'glamgal', 
			password: 'soglam', 
			name: 'Albert', 
			location: 'Canada' 
		});
		
		console.log('finished creating users!');
	}
	catch(error){
		console.error('Error creating users!');
		throw error;
	}
};

const createInitialPosts = async () => {
	try {
		const [albert, sandra, glamgal] = await getAllUsers();
		console.log("starting to create posts...");
		
		await createPost({
		  authorId: albert.id,
      title: "First Post",
      content: "This is my first post. I hope I love writing blogs as much as I love writing them.",
      tags: ["#posty", "#youcanpostanything"]
		});
		
		await createPost({
		  authorId: sandra.id,
      title: "test post",
      content: "This is my test post. I hope I love writing code as much as I love testing them.",
      tags: ["#testy", "#youcantestanything"]
		});
		
		await createPost({
		  authorId: glamgal.id,
      title: "glam post",
      content: "This is my glam post. I hope I love glamming code as much as I love glamming them.",
      tags: ["#glamy", "#youcanglamanything", "#canmanglameverything"]
		});
		
		console.log("Finished creating posts!");
	}
	catch(error) {
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
		await createInitialPosts();
	}
	catch(error){
	console.log("error during rebuildDB");
		throw error;
	}
};

//a function that connects the client to the database, queries the db for all results from users,
//console logs the results, and finally closes the client connection
const testDB = async () => {
	try{
		console.log("Starting to test database...");

    console.log("Calling getAllUsers");
    const users = await getAllUsers();
    console.log("Result:", users);

    console.log("Calling updateUser on users[0]");
    const updateUserResult = await updateUser(users[0].id, {
      name: "Newname Sogood",
      location: "Lesterville, KY"
    });
    console.log("Result:", updateUserResult);

    console.log("Calling getAllPosts");
    const posts = await getAllPosts();
    console.log("Result:", posts);

    console.log("Calling updatePost on posts[0]");
    const updatePostResult = await updatePost(posts[0].id, {
      title: "New Title",
      content: "Updated Content"
    });
    console.log("Result:", updatePostResult);

    console.log("Calling getUserById with 1");
    const albert = await getUserById(1);
    console.log("Result:", albert);
    
    console.log("Calling getAllTags");
    const allTags = await getAllTags();
    console.log("Result:", allTags);

    console.log("Calling getPostsByTagName with #posty");
    const postsWithPosty = await getPostsByTagName("#posty");
    console.log("Result:", postsWithPosty);

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
