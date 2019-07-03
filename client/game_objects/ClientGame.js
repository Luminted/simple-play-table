import ClientCard from './ClientCard.js';
import ClientDeck from './ClientDeck.js';

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
        let gameTable = this.initGameTable(document.querySelector('#gameTable'));
        //Initializing cards
        let cards = initState.cards;
        if(cards != undefined){
            for(let cardId in cards){
                let posX = cards[cardId].posX;
                let posY = cards[cardId].posY;
                let suit = cards[cardId].suit;
                let face = cards[cardId].face;
                let card = new ClientCard(cardId, posX,posY,face,suit);
                this.addCard(card, gameTable);

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
                this.addDeck(deck, gameTable);
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

    addCard(card, DOMElement){
        if(!card instanceof ClientCard){
            throw "Method can only add CardClient objects!";
        }else{
            this._gameObjects.cards[card.id] = card;
            card.attachToDOM(DOMElement);
        }
    }

    addDeck(deck, DOMElement){
        if(!deck instanceof ClientDeck){
            throw "Method can only add ClientDeck objects!";
        }else{
            this._gameObjects.decks[deck.id] = deck;
            deck.attachToDOM(DOMElement);
        }
    }

    get id(){
        return this._id;
    }

    initGameTable(DOMElement){
        DOMElement.style.height = '720px';
        DOMElement.style.width = '960px';
        DOMElement.style.background = 'green';

        return DOMElement;
    }
}