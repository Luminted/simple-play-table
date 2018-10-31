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
        this._cardElement.style.position = 'relative';
        this._cardElement.classList.add('card-ace-of-spades');
        this._cardElement.id = this._id;
        //registering listeners
        // this._cardElement.onmousedown = this.onMouseDown.bind(this);
        // this._cardElement.onmouseup = this.onMouseUp.bind(this);
        // document.addEventListener('mousemove', this.onMouseMove.bind(this));

        console.log('card consturcted ', this._cardElement);
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
            let elementX = parseInt(this._cardElement.style.top);
            let elementY = parseInt(this._cardElement.style.left);
            let deltaX = mouseX - this._mouseGrabX;
            let deltaY = mouseY - this._mouseGrabY;

            // console.log('mousemove ', elementX + deltaX, elementY + deltaY)

            this.moveTo(this._grabbedPosX + deltaX, this._grabbedPosY + deltaY);

        } else {
            return;
        }
    }

    moveTo(coordX, coordY) {
        console.log('move to')
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

    get id(){
        return this._id;
    }
}