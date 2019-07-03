import Card from "./game_objects/ServerCard";
import Deck from "./game_objects/ServerDeck";
import DECK_TYPES from "./game_objects/DeckTypes";
const uuidv1 = require('uuid/v1');


export default class ServerGame{
    constructor(){
        this._id = 'game-' + uuidv1();;
        this._gameObjects = {};
        this._gameObjects.cards = {};
        this._gameObjects.decks = {};
        this._clients = {};

        //setting up test cards
        let deck = new Deck(DECK_TYPES.FRENCH, 150, 150);
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

    get state(){
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

    addCard(card){
        if(card instanceof Card){
            this._gameObjects.cards[card.id] = card;
        }else{
            throw "Only instances of ServerCard are allowed to be added!"
        }
    }

    addDeck(deck){
        if(deck instanceof Deck){
            this._gameObjects.decks[deck.id] = deck;
        }else{
            throw "Only instances of ServerDeck are allowed to be added!"
        }
    }

    get id(){
        return this._id;
    }
}