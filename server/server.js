//Infra import
const express = require('express');
const app = express();
const server = require('http').Server(app);
const io = require('socket.io')(server);
const UUID = require('node-uuid');

//server state
const state = {
  clients: {},
  games: {}
};

//Game logic imports
import ServerGame from './ServerGame.js';

//server setup
server.listen(4004);
app.use(express.static('client'));

init();

//================ Routing ========================

app.get('/', function (req, res) {
  res.sendFile('/client/index.html', {root: './'});
});

//=================================================

function init(){
  console.log('game initiating...');

  io.on('connect', onConnectHandler);
}

//=================== Socket Evenet Emitters =====================

function emitGameInit(){
  let payload = {}
  let game = new ServerGame(UUID());
  state.games[game.id] = game;
  payload.serverGameState = game.getState();
  io.emit('gameInit', payload);
}

//=================== Socket Evenet Handlers =====================

function onConnectHandler(socket) {
  socket.on('gameInitRequest', gameInitRequestHandler);

  let payload = {};
  socket.id = UUID();
  payload.id = socket.id;
  state.clients[socket.id] = socket;
  console.log(socket.id, ' connected');
  socket.emit('onconnect', payload);
}

function gameInitRequestHandler(payload){
  console.log('game init request received ', payload);
  emitGameInit();
}

