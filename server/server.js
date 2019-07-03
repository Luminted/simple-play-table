//Infra import
const express = require('express');
const app = express();
const server = require('http').Server(app);
const io = require('socket.io')(server);
const uuidv1 = require('uuid');

import {
  connectHandler,
gameInitRequestHandler,
mouseMoveHandler,
mouseDownHandler,
mouseUpHandler,
} from './socketEventHandlers';

import {
  emitGameInit,
emitCardUpdate,
broadcastDeckMouseUp,
} from './socketEventEmitters';

import Card from './game_objects/ServerCard.js';
import ServerGame from './ServerGame.js';

//server state
const state = {
  clients: {},
  games: {},
  rooms: {}
};


//server setup
server.listen(4004);
app.use(express.static('client'));

init();

//================ Routing ========================

app.get('/', function (req, res) {
  res.sendFile('/client/views/index.html', {
    root: './'
  });
});


//=================================================

function init() {
  console.log('game initiating...');

  io.on('connect', connectHandler);
}

//=================== Socket Evenet Emitters =====================