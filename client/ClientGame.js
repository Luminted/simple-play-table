import Card from './game_objects/ClientCard.js';

export default class ClientGame{
    /**
     * 
     * @param {*} state 
     */
    constructor(initState){
        this._state = {};
        this._state.cards = {};

        this.initGame(initState);

        console.log('client game ready');
    }

    initGame(initState){
        let cards = initState.cards;
        console.log(initState.cards)
        if(cards != undefined){
            for(let card in cards){
                console.log(card);
            }
        }

    }

    get gameObjects(){
        return this._gameObjects();
    }

    getGameObjectById(id){
        return this._gameObjects[id];
    }

    get id(){
        return this._id;
    }
}