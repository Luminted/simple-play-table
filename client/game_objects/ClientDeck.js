import Card from './ClientCard.js';

export default class ClientDeck{
    constructor(id, type, cards, posX, posY){
        this._CARD_WIDTH = 63;
        this._CARD_HEIGHT = 88;
        this._cardScale = 2;
        this._id = id;
        this._cards = cards;
        this._type = type;
        this._posX = posX;
        this._posY = posY;

        //creating DOM representation
        this._deckElement = document.createElement('div');
        this._deckElement.style.backgroundColor = 'white';
        this._deckElement.style.height = this._CARD_HEIGHT * this._cardScale + 'px';
        this._deckElement.style.width = this._CARD_WIDTH * this._cardScale + 'px';
        this._deckElement.style.top = this._posY + 'px';
        this._deckElement.style.left = this._posX + 'px';
        this._deckElement.style.backgroundSize = this._CARD_WIDTH * this._cardScale + 'px ' + this._CARD_HEIGHT * this._cardScale + 'px';
        this._deckElement.style.position = 'absolute';
        this._deckElement.classList.add('deck-' + this._type);
        this._deckElement.id = this._id;

        console.log('Deck constructed ', this._id);
    }

    draw(){
        let topCard = this._cards.pop();
        console.log('this is a deck');
        return topCard;
    }

    attachToDOM(DOM) {
        DOM.appendChild(this._deckElement);
    }

    get DOM(){
        return this._deckElement;
    }

    onMouseUp(ev){
        console.log('deck card ', this._cards);
        let topCard = this.draw();
        console.log('nmr of cards ', this._cards.length);
        return this.cardFactory(topCard, this._posX, this._posY);
    }

    cardFactory(cardRep, posX,posY){
        let id = cardRep.id;
        let suit = cardRep.suit;
        let face = cardRep.face;
        return new Card(id, posX + 50, posY + 50, face, suit);
    }
    
    get id(){
        return this._id;
    }
}