export default class ClientCard {

    constructor(id, posX, posY, face, suit) {
        //'private' fields
        this._CARD_WIDTH = 63;
        this._CARD_HEIGHT = 88;
        this._cardScale = 2;
        this._isMouseDown = false;
        this._posX = posX;
        this._posY = posY;
        this._id = id;
        this._owner = null;
        this._face = face;
        this._suit = suit;

        //creating DOM representation
        this._cardElement = document.createElement('div');
        this._cardElement.style.backgroundColor = 'white';
        this._cardElement.style.height = this._CARD_HEIGHT * this._cardScale + 'px';
        this._cardElement.style.width = this._CARD_WIDTH * this._cardScale + 'px';
        this._cardElement.style.top = this._posY + 'px';
        this._cardElement.style.left = this._posX + 'px';
        this._cardElement.style.backgroundSize = this._CARD_WIDTH * this._cardScale + 'px ' + this._CARD_HEIGHT * this._cardScale + 'px';
        this._cardElement.style.position = 'absolute';
        this._cardElement.classList.add('card-ace-of-spades');
        this._cardElement.id = this._id;
        //registering listeners
        // this._cardElement.onmousedown = this.onMouseDown.bind(this);
        // this._cardElement.onmouseup = this.onMouseUp.bind(this);
        // document.addEventListener('mousemove', this.onMouseMove.bind(this));

        console.log('card consturcted ', this._id);
    }

    onMouseDown(ev) {
        // console.log('mousedown ', this._isMouseDown);
        this._isMouseDown = true;
        this._mouseGrabX = ev.clientX;
        this._mouseGrabY = ev.clientY;
        this._grabbedPosX = this._posX;
        this._grabbedPosY = this._posY;
    }

    onMouseUp(ev) {
        // console.log('mouseup ', this._isMouseDown);
        this._isMouseDown = false;
    }

    onMouseMove(ev) {
        if (this._isMouseDown) {
            let mouseX = ev.clientX;
            let mouseY = ev.clientY;
            let deltaX = mouseX - this._mouseGrabX;
            let deltaY = mouseY - this._mouseGrabY;
            let boundaryX = ev.customData.boundaryX;
            let boundaryY = ev.customData.boundaryY;
            let calcedX = this._grabbedPosX + deltaX;
            let calcedY = this._grabbedPosY + deltaY;

            let newCoordX = this.clamp(calcedX, 0, boundaryX - this.dimX);
            let newCoordY = this.clamp(calcedY, 0, boundaryY - this.dimY);

            this.moveTo(newCoordX, newCoordY);

        } else {
            return;
        }
    }

    moveTo(coordX, coordY) {
        console.log('pos', coordX, coordY)
        this._posX = coordX;
        this._posY = coordY;
        this._cardElement.style.left = coordX + 'px';
        this._cardElement.style.top = coordY + 'px';
    }

    getDOM() {
        return this._cardElement;
    }

    attachToDOM(DOM) {
        DOM.appendChild(this._cardElement);
    }

    update(payload){
       this.moveTo(payload.posX, payload.posY);
    }

    clamp(val, min, max) {
        console.log(val);
        if (val < min) {
            return min;
        }
        if (val > max) {
            return max;
        }
        return val;
    }    

    get posX(){
        return this._posX;
    }

    get posY(){
        return this._posY;
    }

    get dimX(){
        return this._CARD_WIDTH * this._cardScale;
    }

    get dimY(){
        return this._CARD_HEIGHT * this._cardScale;
    }

    get id(){
        return this._id;
    }
}