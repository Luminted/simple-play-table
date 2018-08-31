import Card from "./game_objects/ServerCard";

export default class ServerGame{
    constructor(id){
        this._id = id;
        this._state = {};
        this._state._gameObjects = {};
        this._state._gameObjects.cards = {};
        this._state.clients = {};

        //setting up test cards
        let card = new Card(100,100);
        let card2 = new Card(100,10);
        let card3 = new Card(10,100);
        let card4 = new Card(200,200);
        this.gameObjects.cards[card.id] = card;
        this.gameObjects.cards[card2.id] = card2;
        this.gameObjects.cards[card3.id] = card3;
        this.gameObjects.cards[card4.id] = card4;

        console.log('server game ready');
    }

    initGame(){
        let card = new Card(100,100);
        this._state._gameObjects.cards[card.id] = card;
        return this.state;
    }

    get gameObjects(){
        return this._state._gameObjects;
    }

    getGameObjectById(id){
        return this._gameObjects[id];
    }

    getState(){
        return {
            cards: this._state._gameObjects.cards
        };
    }

    addClient(client){
        this._state[client.id] = client;
    }

    get id(){
        return this._id;
    }
}