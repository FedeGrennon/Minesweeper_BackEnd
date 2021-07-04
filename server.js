require('dotenv').config();
const express = require('express');
const app = express();
const http = require('http').createServer(app);
const io = require('socket.io')(http);
const sslRedirect = require('heroku-ssl-redirect');
const socketMessageManager = require('./src/js/SocketMessageManager');

app.use(sslRedirect());
app.use(express.json());

const routes = require('./api/routes/Routes');
routes(app);

io.on('connection', (socket) => 
{
  console.log('client join.');
  socketMessageManager.Messages(socket, io);
});

const port = process.env.PORT || 9000;
http.listen(port, () => {
  console.log(`listening in port: ${port}`);
});