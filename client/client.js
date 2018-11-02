;
import Card from './game_objects/ClientCard';
import Deck from './game_objects/ClientDeck';
import ClientGame from './ClientGame.js';

window.onload = init;

//client state
const state = {};

/**
 * Initializes application.
 */
function init() {
    //connect to server socket
    let socket = io.connect('http://localhost:4004');
    state.socket = socket;

    state.isMouseDown = false;
    state.grabbedCard = null;

    socket.on('onconnect', onConnectHandler);
    socket.on('gameInit', onGameInitHandler);
    socket.on('cardUpdate', cardUpdateHandler);

    //attaching emitters to DOM events
    document.addEventListener('mousemove', onDOMMouseMove);

    document.addEventListener('mousedown', onDOMMouseDown);

    document.addEventListener('mouseup', onDOMMouseUp);
}

//================== Socket Event Emitters ==================

function emitGameInitRequest() {
    let payload = {
        clientId: state.id
    }
    state.socket.emit('gameInitRequest', payload)
}

function emitMouseMove(injectedPayload) {
    let payload = {
        clientId: state.id,
        gameId: state.game.id,
    };
    Object.assign(payload, injectedPayload);
    state.socket.emit('mouseMove', payload);
}

function emitMouseDown(injectedPayload) {
    let payload = {
        clientId: state.id,
        gameId: state.game.id,
    };
    Object.assign(payload, injectedPayload);
    state.socket.emit('mouseDown', payload);
}

function emitMouseUp(injectedPayload) {
    let payload = {
        clientId: state.id,
        gameId: state.game.id,
    };
    Object.assign(payload, injectedPayload);
    state.socket.emit('mouseUp', payload);
}

//================== Socket Event Handlers ==================

function cardUpdateHandler(payload) {
    let card = state.game.getGameObjectById(payload.id);
    if (card) {
        card.update(payload);
    } else {
        let newCard = new Card(payload.id, payload.posX, payload.posY, payload.face, payload.suit);
        state.game.addCard(newCard);
    }
}

function deckUpdateHandler(payload) {
    let deck = state.game.getGameObjectById(payload.id);
    if(deck){
        deck.update(payload);
    }else{
        let newDeck = new Deck(payload.id,payload.type,payload.cards,payload.posX, payload.posY);
        game.addDeck(newDeck);
    }
}

/**
 * Handles payload sent back from server after connection.
 * @param {expected fields of payload object: id} payload 
 */
function onConnectHandler(payload) {
    state.id = payload.id;
    console.log('client id: ', payload.id);
    console.log('req sent');
    emitGameInitRequest();
}

/**
 * 
 * @param {expected fields of object: gameState} payload 
 */
function onGameInitHandler(payload) {
    let newGame = new ClientGame(payload.serverGameState);
    state.game = newGame;
    //console.log('game init ', payload.serverGameState);
}

//================ DOM Event Handlers =======================

function onDOMMouseMove(ev) {
    ev.preventDefault();

    if (state.isMouseDown) {
        //notify client
        if (state.grabbedCard !== null) {
            state.grabbedCard.onMouseMove(ev);
        }
        //notify server
        let injectedPayload = {
            targetId: state.grabbedCard.id,
            clientX: ev.clientX,
            clientY: ev.clientY
        }
        emitMouseMove(injectedPayload);
    }
}

function onDOMMouseUp(ev) {
    ev.preventDefault();
    let id = ev.target.id;
    if (id) {
        let idPrefix = id.split('-')[0];
        switch (idPrefix) {
            case ('card'):
                if (state.grabbedCard !== null) {
                    //notify client
                    state.grabbedCard.onMouseUp(ev);

                    state.isMouseDown = false;
                    //notify server
                    let injectedPayload = {
                        targetId: state.grabbedCard.id
                    }


                    //reset reference of moved card
                    state.grabbedCard = null;
                    //console.log('emit mouse up', injectedPayload);
                    emitMouseUp(injectedPayload);
                }
                break;
            case ('deck'):
                let injectedPayload = {
                    targetId: id
                }
                let deck = state.game.getGameObjectById(id);
                let newCard = deck.onMouseUp(ev);
                state.game.addCard(newCard);
                emitMouseUp(injectedPayload);
                break;
        }
    }
}

function onDOMMouseDown(ev) {
    ev.preventDefault();
    let id = ev.target.id;
    let idPrefix = id.split('-')[0];
    switch (idPrefix) {
        case ('card'):
            //notify client
            let target = state.game.getGameObjectById(id)
            if (target && target.onMouseDown) {
                target.onMouseDown(ev);
                state.isMouseDown = true;
                state.grabbedCard = target;
            }
            //notify server
            let injectedPayload = {
                targetId: id,
                clientX: ev.clientX,
                clientY: ev.clientY
            }
            emitMouseDown(injectedPayload);

            //console.log('emit mouse down',injectedPayload);

            break;
    }

}