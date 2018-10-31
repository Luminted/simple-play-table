const UUID = require('node-uuid');
const fs = require('fs');
import Card from './ServerCard.js';

export default class ServerDeck {
    constructor(type, posX, posY) {
        console.log('initializing ', type, ' deck');
        this._id = 'deck-' + UUID();
        //Raw card date. Should be shuffled.
        this._cards = [];
        this._type = type;
        this._posX = posX;
        this._posY = posY;

        //reading config, populating cards list based on config and shuffling it.
        this.readFileAsync('/home/leventerozsenich/Documents/web-dev/simple_card_sandbox/server/config/' + type + '_deck_config.json').then(
            function (buffer) {
                return new Promise(function (resolve, reject) {
                    try {
                        let config = JSON.parse(buffer);
                        let deck = []
                        for (let suit in config.cards) {
                            for (let card in config.cards[suit]) {
                                deck.push({
                                    suit: suit,
                                    face: card
                                });
                            }
                        }
                        resolve(deck);
                    } catch (err) {
                        reject(err);
                    }

                })
            }).then((function (deck) {
            this._cards = this.shuffle(deck);
        }.bind(this)));
    }

    populateCardListFromConfig(err, data) {
        let config = JSON.parse(data);
        for (let suit in config.cards) {
            for (let card in config.cards[suit]) {
                this._cards.push({
                    suit: suit,
                    face: card
                });

            }
        }
    }

    onMouseUp(ev){
        let topCard = this._cards.pop();
        return this.cardFactory(topCard, this._posX, this.posY); 
    }

    cardFactory(cardRep, posX,posY){
        return newCard = new Card(this._posX, this._posY, cardRep.suit, cardRep.face);
    }

    /**
     * Implements Fisher–Yates shuffle algorithm.
     * @param {array to be shuffled} array 
     */
    shuffle(array) {
        var m = array.length,
            t, i;

        // While there remain elements to shuffle…
        while (m) {

            // Pick a remaining element…
            i = Math.floor(Math.random() * m--);

            // And swap it with the current element.
            t = array[m];
            array[m] = array[i];
            array[i] = t;
        }

        return array;
    }

    /**
     * Reads files asyncronously as a Promise.
     * @param {File to be read.} filename 
     */
    readFileAsync(filename) {
        return new Promise(function (resolve, reject) {
            try {
                fs.readFile(filename, function (err, buffer) {
                    if (err) {
                        reject(err)
                    } else {
                        resolve(buffer);
                    }
                });
            } catch (err) {
                reject(err);
            }
        });
    };

    get state(){
        return{
            id: this._id,
            type: this._type,
            cards: this._cards,
            posX: this._posX,
            posY: this._posY
        }
    }

    get id(){
        return this._id;
    }

    get position(){
        return{
            posX: this.posX,
            posY: this.posY
        }
    }
}