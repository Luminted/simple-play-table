//Infra import
const express = require('express');
const app = express();
const server = require('http').Server(app);
const io = require('socket.io')(server);
const UUID = require('node-uuid');

import Card from './game_objects/ServerCard.js';

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
  res.sendFile('/client/index.html', {
    root: './'
  });
});

//=================================================

function init() {
  console.log('game initiating...');

  io.on('connect', connectHandler);
}

//=================== Socket Evenet Emitters =====================

/**
 * Emit game state for game init request of client
 * @param {a specific socket the emit should be sent to} socket 
 * @param {payload from outside of emitter function} injectedPayload 
 */
function emitGameInit(injectedPayload, socket) {
  let payload = {}
  if (Object.keys(state.games).length == 0) {
    let game = new ServerGame(UUID());
    state.games[game.id] = game;
    payload.serverGameState = game.state;
  } else {
    let game = state.games[Object.keys(state.games)[0]];
    payload.serverGameState = game.state;
  }

  Object.assign(payload, injectedPayload);

  if (socket !== undefined) {
    socket.emit('gameInit', payload);
  } else {
    io.emit('gameInit', payload);
  }

}

function emitCardUpdate(injectedPayload, socket) {
  let payload = {};
  //console.log(injectedPayload)
  Object.assign(payload, injectedPayload);

  if (socket !== undefined) {
    socket.emit('cardUpdate', payload);
  } else {
    io.emit('cardUpdate', payload);
  }
}

function emitDeckUpdate(injectedPayload, socket){
  let payload = {};
  Object.assign(payload, injectedPayload);

  if (socket !== undefined) {
    socket.emit('deckUpdate', payload);
  } else {
    io.emit('deckUpdate', payload);
  }

}

//=================== Socket Evenet Handlers =====================

function connectHandler(socket) {
  socket.on('gameInitRequest', gameInitRequestHandler);
  socket.on('mouseMove', mouseMoveHandler);
  socket.on('mouseDown', mouseDownHandler);
  socket.on('mouseUp', mouseUpHandler);

  let payload = {};
  socket.id = UUID();
  payload.id = socket.id;
  state.clients[socket.id] = socket;

  console.log(socket.id, ' connected');
  socket.emit('onconnect', payload);
}

/**
 * Starts initiation of game on request from client.
 * @param {*} payload 
 */
function gameInitRequestHandler(payload) {
  console.log('game init request received ', payload);
  let partialPayload = {}
  let socket = state.clients[payload.clientId];
  emitGameInit(partialPayload, socket);
}

/**
 * Mirror of 'mousemove' DOM event on server side
 * @param {contains mouse coordinates from client event} payload
 */
function mouseMoveHandler(payload) {
  let object = state.games[payload.gameId].getGameObjectById(payload.targetId);
  if (object) {
    let objectIdPrefix = object.id.split('-')[0];
    switch (objectIdPrefix) {
      case ('card'):
        if (object.owner === payload.clientId) {
          object.onMouseMove(payload);
          emitCardUpdate(object.state);
        }
        break;
    }
  }

}

function mouseDownHandler(payload) {
  let object = state.games[payload.gameId].getGameObjectById(payload.targetId);
  if (object) {
    let objectIdPrefix = object.id.split('-')[0];
    switch (objectIdPrefix) {
      case ('card'):
        if (object.owner === null) {
          object.onMouseDown(payload);
        }
        break;
    }
  }

}

function mouseUpHandler(payload) {
  let object = state.games[payload.gameId].getGameObjectById(payload.targetId);
  console.log(object.id);
  if (object) {
    let objectIdPrefix = object.id.split('-')[0];
    switch (objectIdPrefix) {
      case ('card'):
        if (object.owner === payload.clientId) {
          object.onMouseUp(payload);
          emitCardUpdate(object.state);
        }
        console.log('card branch', object.id);
        break;
      case ('deck'):
        let drawnCard = object.onMouseUp(payload);
        console.log('drawn card id ', drawnCard.id);
        let game = state.games[payload.gameId];
        game.addCard(drawnCard);
        emitCardUpdate(drawnCard.state);
        let socket = state.clients[payload.clientId];
        emitDeckUpdate(object.state, socket);
        break;
    }
  }

}