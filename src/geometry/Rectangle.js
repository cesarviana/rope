import Point from './Point'
export default class Rectangle {
    constructor($elm) 
    {
        this.setElm($elm)
    }
    setElm($elm, horizontalScroll) {
        this.$elm = $elm
        this.height = $elm.height()
        this.width = $elm.width()
        this.y = $elm.offset().top
        this.x = $elm.offset().left + (horizontalScroll || 0)
    }
    contains(obj) {
        if (obj instanceof Point) {
            let point = obj
            return this.y <= point.y &&
                this.y + this.height >= point.y &&
                this.x <= point.x &&
                this.x + this.width >= point.x
        } else if(obj instanceof Rectangle) {
            return this.contains(obj.center())
        }
    }
    center(horizontalScroll) {
        let centerX = this.x + (horizontalScroll || 0) + (this.width / 2)
        let centerY = this.y + (this.height / 2)
        return new Point(centerX, centerY)
    }
    getX(){
        return this.$elm.offset().left
    }
    getWidth(){
        return this.$elm.width()
    }
    moveTo(obj, options, callback) {
        if (obj instanceof Rectangle) {
            obj = obj.$elm
        }
        if (obj instanceof jQuery) {
            const x = obj.offset().left
            const y = obj.offset().top
            this.moveToPoint(new Point(x, y), options, callback)
        }
        if (obj instanceof Point) {
            this.moveToPoint(obj, options, callback)
        }
    }
    moveToPoint(point, options, callback) {

        const opt = options || { animationDuration: 200 }

        this.moving = true
        this.$elm.animate({
            top: point.y,
            left: point.x
        }, opt.animationDuration, function () {
            this.moving = false,
            callback.call(this)
        })
    }
    sideOf(obj) {
        if (obj instanceof Point) {
            return this.center().x > obj.x ? this.LEFT : this.RIGHT
        }
    }
    id() {
        return this.$elm[0].id
    }
    setDragged() {
        this.$elm
            .addClass('dragged')
            .removeClass('ready')
            .css({ 'z-index': 1000 })
    }
    dragged(){
        return this.$elm.hasClass('dragged')
    }
    disappear() {
        this.$elm.fadeOut(200, () => this.$elm.remove())
    }
    empty() {
        return !this.internalRectangle
    }
    add(obj) {
        this.$elm.append(obj.$elm).removeClass('freed')
        obj.$elm.css({ position:'relative', top: 0, left: 0 })
        return this.internalRectangle = obj
    }
    has(obj) {
        return obj === this.internalRectangle
    }
    frees() {
        this.$elm.addClass('freed')
        this.internalRectangle = undefined
    }
    toString(){
        return this.internalRectangle ? this.internalRectangle.id : 'vazio'
    }
}
Rectangle.prototype.LEFT = -1
Rectangle.prototype.RIGHT = 1