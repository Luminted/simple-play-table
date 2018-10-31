import ClientCard from './game_objects/ClientCard.js';
import ClientDeck from './game_objects/ClientDeck.js';

export default class ClientGame{
    /**
     * 
     * @param {*} state 
     */
    constructor(initState){
        this._gameObjects = {}
        this._gameObjects.cards = {};
        this._gameObjects.decks = {};

        this.initGame(initState);

        console.log('client game ready');
    }

    initGame(initState){
        this._id = initState.gameId;
        let gameArea = document.querySelector('#gameTable');
        //Initializing cards
        let cards = initState.cards;
        if(cards != undefined){
            for(let cardId in cards){
                let posX = cards[cardId].posX;
                let posY = cards[cardId].posY;
                let card = new ClientCard(cardId, posX,posY);
                this._gameObjects.cards[cardId] = card;
                card.attachToDOM(gameArea);

            }
        }
        //Initializing decks
        let decks = initState.decks;
        if(decks != undefined){
            for(let deckId in decks){
                let posX = decks[deckId].posX;
                let posY = decks[deckId].posY;
                let cards = decks[deckId].cards;
                let type = decks[deckId].type;
                let deck = new ClientDeck(deckId, type, cards, posX, posY);
                this._gameObjects.decks[deckId] = deck;
                deck.attachToDOM(gameArea);
            }
        }

    }

    get gameObjects(){
        return this._gameObjects;
    }

    getGameObjectById(id){
        let gameObjects = this._gameObjects;
        let object = gameObjects.cards[id] || gameObjects.decks[id];
        return object;
    }

    addCard(card){
        if(!card instanceof ClientCard){
            throw "Method can only add CardClient objects!";
        }else{
            this._gameObjects.cards[card.id] = card;
            card.attachToDOM(document.querySelector('#gameTable'));
        }
    }

    get id(){
        return this._id;
    }
}