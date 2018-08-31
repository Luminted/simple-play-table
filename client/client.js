;import Card from './game_objects/ClientCard.js';
import ClientGame from './ClientGame.js';

window.onload = init;

//client state
const state = {};

/**
 * Initializes application.
 */
function init(){
    //connect to server socket
    let socket = io.connect('http://localhost:4004');
    state.socket = socket;

    socket.on('onconnect', onConnectHandler);
    socket.on('gameInit', onGameInitHandler);
}

//================== Socket Event Emitters ==================

function emitGameInitRequest(){
    let payload = {
        clientId: state.id
    }
    state.socket.emit('gameInitRequest', payload)
}

//================== Socket Event Handlers ==================

/**
 * Handles payload sent back from server after connection.
 * @param {expected fields of payload object: id} payload 
 */
function onConnectHandler(payload){
    state.id = payload.id;
    console.log('client id: ', payload.id);
    console.log('req sent');
    emitGameInitRequest();
}

/**
 * 
 * @param {expected fields of object: gameState} payload 
 */
function onGameInitHandler(payload){
    let game = new ClientGame(payload.serverGameState);
    state.game = game;
    console.log('game init ', payload.serverGameState);
}