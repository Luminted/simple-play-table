const uuidv1 = require('uuid/v1');

export default class ServerCard {
    constructor(posX, posY, suit, face, id) {
        console.log('created with give id ', id);
        if(id){
            this._id = id;
        }else{
            this._id = 'card-' + uuidv1();
        }
        this._posX = posX;
        this._posY = posY;
        this._suit = suit;
        this._face = face;
        this._owner = null;
    }

    onMouseDown(payload) {
        if (this._owner === null) {
            this._owner = payload.clientId;
            this._mouseGrabX = payload.clientX;
            this._mouseGrabY = payload.clientY;
            this._grabbedPosX = this._posX;
            this._grabbedPosY = this._posY;
        }
    }

    onMouseUp(payload) {
        this._owner = null;
    }

    onMouseMove(payload) {
        if (this._owner && this._owner === payload.clientId) {
            let mouseX = payload.clientX;
            let mouseY = payload.clientY;
            let boundaryX = payload.boundaryX;
            let boundaryY = payload.boundaryY;
            let dimX = payload.dimX;
            let dimY = payload.dimY;
            let deltaX = mouseX - this._mouseGrabX;
            let deltaY = mouseY - this._mouseGrabY;
            let calcedX = this._grabbedPosX + deltaX;
            let calcedY = this._grabbedPosY + deltaY;

            // console.log('mousemove ', elementX + deltaX, elementY + deltaY)

            this._posX = this.clamp(calcedX, 0, boundaryX - dimX);
            this._posY = this.clamp(calcedY, 0, boundaryY - dimY);

            console.log('pos ', this._posX, this._posY);
        }
    }

    clamp(val, min, max) {
        if (val < min) {
            return min;
        }
        if (val > max) {
            return max;
        }
        return val;
    }

    get state() {
        return {
            posX: this._posX,
            posY: this._posY,
            owner: this._owner,
            id: this._id,
            face: this._face,
            suit: this._suit
        }
    }

    get pos(){
        return {
            posX: this._posX,
            posY: this._posY
        }
    }

    get id() {
        return this._id;
    }

    get owner() {
        return this._owner;
    }
}