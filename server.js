const express = require('express');
const userRouter = require('./users/userRouter.js');

const server = express();

server.use(express.json());
server.use(logger);

server.use('/api/users', userRouter);

server.get('/', (req, res) => {
  res.send(`<h2>Let's write some middleware!</h2>`);
});

//custom middleware

function logger(req, res, next) {
  var d = new Date(Date.now());
  console.log(`${req.method} request from http://localhost:4000${req.url} at ${d.toString()}}`);
  next();
}

server.use((error, req, res, next) => {
  res.status(error.code).json({ message: 'There was an error', error });
});

module.exports = server;