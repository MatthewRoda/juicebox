//server init
require('dotenv').config();
const { PORT = 3000 } = process.env;
const express = require('express');
const server = express();
const bodyParser = require('body-parser');
server.use(bodyParser.json());

const morgan = require('morgan');
server.use(morgan('dev'));

const { client } = require('./db');
client.connect();

server.listen(PORT, () => {
	console.log('the server is up on port', PORT)
});

//routers
const apiRouter = require('./api');
server.use('/api', apiRouter);

server.use((req, res, next) => {
	console.log("<____Body Logger START____>");
	console.log(req.body);
	console.log("<___Body Logger END___>");
	
	next();
});


