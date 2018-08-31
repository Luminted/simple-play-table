const UUID = require('node-uuid');

export default class ServerCard {
    constructor(posX, posY) {
        this._id = UUID();
        this._posX = posX;
        this._posY = posY;
        this._isMouseDown = false;
    }

    onMouseDown(payload) {
        this._isMouseDown = true;
        this._mouseGrabX = payload.clientX;
        this._mouseGrabY = payload.clientY;
        this._grabbedPosX = this._posX;
        this._grabbedPosY = this._posY;
    }

    onMouseUp(payload) {
        this._isMouseDown = false;
    }

    onMouseMove(payload) {
        if (this._isMouseDown) {
            let mouseX = paylaod.clientX;
            let mouseY = payload.clientY;
            let deltaX = mouseX - this._mouseGrabX;
            let deltaY = mouseY - this._mouseGrabY;

            // console.log('mousemove ', elementX + deltaX, elementY + deltaY)

            this._posX = this._grabbedPosX + deltaX;
            this._posX = this._grabbedPosY + deltaY;
        }
    }

    get state(){
        return {
            posX: this._posX,
            posY: this._posY,
            isMouseDown: this._isMouseDown
        }
    }

    get id(){
        return this._id;
    }
}