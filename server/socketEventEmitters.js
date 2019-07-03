/**
 * Emit game state for game init request of client
 * @param {a specific socket the emit should be sent to} socket 
 * @param {payload from outside of emitter function} injectedPayload 
 */
export function emitGameInit(injectedPayload, socket) {
    let payload = {}
    if (Object.keys(state.games).length == 0) {
        let game = new ServerGame(uuidv1());
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

export function emitCardUpdate(injectedPayload, socket) {
    let payload = {};
    //console.log(injectedPayload)
    Object.assign(payload, injectedPayload);

    if (socket !== undefined) {
        socket.emit('cardUpdate', payload);
    } else {
        io.emit('cardUpdate', payload);
    }
}

export function broadcastDeckMouseUp(injectedPayload, socket) {
    let payload = {};
    Object.assign(payload, injectedPayload);
    if (socket !== undefined) {
        socket.broadcast.emit('deckMouseUp', payload);
    }
}