import Card from "./game_objects/ServerCard";
import Deck from "./game_objects/ServerDeck";
import DECK_TYPES from "./game_objects/DeckTypes";
const UUID = require('node-uuid');


export default class ServerGame{
    constructor(){
        this._id = 'game-' + UUID();;
        this._gameObjects = {};
        this._gameObjects.cards = {};
        this._gameObjects.decks = {};
        this._clients = {};

        //setting up test cards
        let card = new Card(100,100);
        let deck = new Deck(DECK_TYPES.FRENCH, 150, 150);
        this.gameObjects.cards[card.id] = card;
        this.gameObjects.decks[deck.id] = deck;

        console.log('server game ready');
    }

    get gameObjects(){
        return this._gameObjects;
    }

    getGameObjectById(id){
        let object = this._gameObjects.cards[id] || this._gameObjects.decks[id];
        return object;
    }

    getState(){
        let cardStates = {};
        let cards = this._gameObjects.cards;
        for(let cardId in cards){
            cardStates[cardId] = cards[cardId].state;
        }
        let deckStates = {}
        let decks = this._gameObjects.decks;
        for(let deckId in decks){
            deckStates[deckId] = decks[deckId].state;
        }
        return {
            gameId: this._id,
            cards: cardStates,
            decks: deckStates,
        };
    }

    addClient(client){
        this._clients[client.id] = client;
    }

    get id(){
        return this._id;
    }
}