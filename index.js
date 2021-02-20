const PORT = 3000;
const express = require('express');
const server = express();

server.listen(PORT, () => {
	console.log('the server is up on port', PORT)
});

server.use((req, res, next) => {
	console.log("<____Body Logger START____>");
	console.log(req.body);
	console.log("<___Body Logger END___>");
	
	next();
});
