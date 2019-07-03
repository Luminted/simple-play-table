export function connectHandler(socket) {
    socket.on('gameInitRequest', gameInitRequestHandler);
    socket.on('mouseMove', mouseMoveHandler);
    socket.on('mouseDown', mouseDownHandler);
    socket.on('mouseUp', mouseUpHandler);

    let payload = {};
    socket.id = uuidv1();
    payload.id = socket.id;
    state.clients[socket.id] = socket;

    console.log(socket.id, ' connected');
    socket.emit('onconnect', payload);
}

/**
 * Starts initiation of game on request from client.
 * @param {*} payload 
 */
export function gameInitRequestHandler(payload) {
    console.log('game init request received ', payload);
    let partialPayload = {}
    let socket = state.clients[payload.clientId];
    emitGameInit(partialPayload, socket);
}

/**
 * Mirror of 'mousemove' DOM event on server side
 * @param {contains mouse coordinates from client event} payload
 */
export function mouseMoveHandler(payload) {
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

export function mouseDownHandler(payload) {
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

export function mouseUpHandler(payload) {
    let entity = state.games[payload.gameId].getGameObjectById(payload.targetId);
    console.log(entity.id);
    if (entity) {
        let objectIdPrefix = entity.id.split('-')[0];
        switch (objectIdPrefix) {
            case ('card'):
                if (entity.owner === payload.clientId) {
                    entity.onMouseUp(payload);
                    emitCardUpdate(entity.state);
                }
                break;
            case ('deck'):
                let drawnCard = entity.onMouseUp(payload);
                console.log('drawn card id ', drawnCard.id);
                let game = state.games[payload.gameId];
                game.addCard(drawnCard);
                let socket = state.clients[payload.clientId];
                let injectedPayload = {
                    deckId: payload.targetId
                }
                broadcastDeckMouseUp(injectedPayload, socket);
                break;
        }
    }

}