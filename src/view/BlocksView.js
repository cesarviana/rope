/* global Rectangle $ */
import * as $ from 'jquery';
import 'jquery-ui-bundle';

// https://stackoverflow.com/questions/39348579/how-to-import-jquery-ui-touch-punch-in-angular-2-webpack-app
// The require is important, vide link
(window).jQuery = $;
require('jquery-ui-touch-punch');

const audio = new Audio('assets/snapsound.mp3')

import Rectangle from '../geometry/Rectangle'
import Point from '../geometry/Point'

export default class BlocksView {

    constructor() {
        this.idCounter = 0
        this.pieces = []
        this.placeholders = []
        this.clickedIds = []
        this.$programmingView = $('#programming-view')
        this.$placeholdersArea = $('#placeholders-area')
        this.highlightPiece = new Rectangle($('#highlight'))
        this.isTimeToSnap = true

        this.callbacks = []

        this.createInitialPieces()
        this.createInitialPlaceholders()
        this.preventRightClick()

        $('#placeholders-area-wrapper').scroll((e)=>{
            this.scroll = $(e.currentTarget).scrollLeft()
        })
    }

    createInitialPieces() {
        $('.available.block.piece').on('mousedown', (e) => {
            this.cloneAndCreatePiece($(e.target))
        }).trigger('mousedown')
    }

    cloneAndCreatePiece($elm) {
        let $cloned = this.clone($elm)
        return this.createPiece($cloned)
    }

    createInitialPlaceholders() {
        $('.block.placeholder').each((idx, elm) => {
            this.placeholders.push(new Rectangle($(elm)))
        })
    }

    preventRightClick() {
        document.addEventListener('contextmenu', event => event.preventDefault());
    }

    clone($elm) {
        let $cloned = $elm.clone()
        $cloned
            .removeClass('available')
            .addClass('ready')
            .css('position', 'absolute').css($elm.offset())
            .appendTo(this.$programmingView)
            .draggable({
                start: (e) => this.handleDragStart(e),
                stop: (e) => this.handleDragStop(e),
                drag: (e) => this.handleDrag(e),
                scroll: false
            }).mouseup((e)=>this.notifyClickedPiece(e))
            .mousedown((e)=>this.changeStartDraggingPosition(e))

        let id = ++this.idCounter
        $cloned.id = id
        $cloned[0].id = id
        return $cloned
    }

    getOrCreatePiece(e) {
        let elm = e.target
        let id = elm.id
        let foundPiece = this.findPieceById(id)
        return foundPiece || this.createPiece($(elm))
    }

    createPiece($elm) {
        let piece = new Rectangle($elm)
        this.pieces.push(piece)
        return piece
    }

    findPieceById(id) {
        let foundPiece = this.pieces
            .filter((piece) => piece instanceof Rectangle && piece.id() == id)
        if (foundPiece.length) {
            return foundPiece[0]
        }
    }

    handleDragStart(e) {

        // this.updatePiecesElements()
        
        this.startDragPiecesIds = this.getPiecesIdsString()
        
        let movingPiece = this.getOrCreatePiece(e)
       
        this.isTimeToSnap = false
        setTimeout(() => {
            this.isTimeToSnap = true
        }, 300)
        this.freesPlaceholder(movingPiece)
        this.organizePostionZ(movingPiece)
        if (!movingPiece.dragged()) { // first move, create new piece below, to be used after
            this.clone(movingPiece.$elm)
            movingPiece.setDragged()
        }
    }

    handleDrag(e) {
        let movingPiece = this.getOrCreatePiece(e)
        movingPiece.setElm($(e.target))
        movingPiece.setDragged()
        this.moveSnapedPieceIfIsTimeToSnap(movingPiece)
        // this.setPieceEnteredPlaceholdersArea(movingPiece)
        this.addOrRemoveOutsideBorder(movingPiece)
    }

    handleDragStop(e) {
        let piece = this.getOrCreatePiece(e)
        
        if(this.isOverPlaceholder(piece)){
            const placeholder = this.getOveredPlaceholder(piece)
            this.snap(placeholder, piece)
        } else {
            if(this.isOutside(piece)){
                this.remove(piece)
            } else {
                this.appendToPlaceholdersArea(piece)
            }
        }

        this.movePiecesToLeft()
        this.adjustAreaWidth()
        this.addRightPlaceholder()
        this.removeRemainingPlaceholders()
        this.notifyChangedPiecesIfChanged()
    }

    getPiecesIdsString(){
        let piecesState = ''
        this.getSnappedPieces().forEach(piece=>{
            piecesState += piece.id()
        })
        return piecesState
    }

    setPieceEnteredPlaceholdersArea(movingPiece) {
        const placeholdersRectangle = this.getPlaceholdersRectangle()
        if (placeholdersRectangle.contains(movingPiece.center(this.scroll))) {
            movingPiece.enteredPlaceholdersArea = true
        }
    }

    addOrRemoveOutsideBorder(movingPiece) {
        const nowIsOutside = this.isOutside(movingPiece)
        const elm = movingPiece.$elm.find('img')[0]
        const $img = $(elm)
        let src = $img.attr('src')
        const hasOutsideBorder = src.indexOf('_exit') !== -1
        if (nowIsOutside && !hasOutsideBorder) {
            const split = src.split('.')
            src = split[0] + '_exit.svg'
            $img.attr('src', src)
        } else if (!nowIsOutside && hasOutsideBorder) {
            src = src.replace('_exit', '')
            $img.attr('src', src)
        }
    }

    getPlaceholdersRectangle() {
        return new Rectangle($('#placeholders-area'))
    }

    organizePostionZ(piece) {
        let id = piece.id()
        let i = this.clickedIds.indexOf(id)
        if (i != -1) {
            this.clickedIds.splice(i, 1)
        }
        this.clickedIds.push(id)
        $('.piece.dragged').each((i, elm) => {
            let zIndex = this.clickedIds.indexOf(elm.id) + 10
            $(elm).css('z-index', zIndex)
        })
    }

    movePiecesToLeft() {
        let i = 0
        while (i < this.placeholders.length) {
            let placeholder = this.placeholders[i]
            if (placeholder.empty()) {
                let j = i
                let rightOccuped
                while (j < this.placeholders.length && !rightOccuped) {
                    if (!this.placeholders[j].empty()) {
                        rightOccuped = this.placeholders[j]
                    }
                    j++
                }
                if (rightOccuped) {
                    const internalRectangle = rightOccuped.internalRectangle
                    rightOccuped.frees()
                    this.snap(placeholder, internalRectangle)
                }
            }
            i++
        }
    }

    adjustAreaWidth() {
        const PIECE_SIZE = 70
        const SCREEN_WIDTH = $(window).width()
        const padding = PIECE_SIZE
        const newWidth = (this.placeholders.length * PIECE_SIZE) + padding
        this.$placeholdersArea.css('min-width', newWidth < SCREEN_WIDTH ? SCREEN_WIDTH : newWidth)
    }

    getOccupedPlaceholders() {
        return this.placeholders.filter(p => !p.empty())
    }

    getFreePlaceholders() {
        return this.placeholders.filter(p => p.empty())
    }

    getSnappedPieces() {
        return this.getOccupedPlaceholders().map((placeholder) => placeholder.internalRectangle)
    }

    freesPlaceholder(movingPiece) {
        this.placeholders.forEach(placeholder => {
            if(placeholder.has(movingPiece))
            {
                placeholder.frees()
            }
        });
    }

    remove(piece) {
        piece.disappear()
        this.pieces.splice(this.pieces.indexOf(piece), 1)
    }

    appendToPlaceholdersArea(piece){
        const left = piece.x
        piece.$elm.css('left', this.scroll + left)
        piece.$elm.appendTo(this.$placeholdersArea)
    }

    isOutside(piece){
        return !this.getPlaceholdersRectangle().contains(piece.center())
    }

    getOveredPlaceholder(piece){
        let center = piece.center()
        return this.placeholders.find(placeholder => placeholder.contains(center))
    }

    isOverPlaceholder(piece){
        return this.getOveredPlaceholder(piece) !== undefined
    }

    snap(placeholder, piece) {
        placeholder.add(piece)
        audio.play()
        // this.placeholders.forEach((p)=>{
        //     console.log(p)
        // })
        // console.log('-----')
    }

    addRightPlaceholder() {
        const ocuppedPlaceholders = this.getOccupedPlaceholders()
        if (this.placeholders.length === ocuppedPlaceholders.length) {
            this.createPlaceholder(Rectangle.prototype.RIGHT)
        }
    }
    
    createPlaceholder(side) {
        const $placeholderBase = $($('.placeholder')[0])
        const $placeholderClone = $placeholderBase.clone()
        $placeholderClone.empty()

        const placeholder = new Rectangle($placeholderClone)
        if (side === Rectangle.prototype.LEFT) {
            this.$placeholdersArea.prepend($placeholderClone)
            this.placeholders.unshift(placeholder)
        } else {
            this.$placeholdersArea.append($placeholderClone)
            this.placeholders.push(placeholder)
        }
        this.adjustAreaWidth()
        this.updatePlaceholderElements()
        return placeholder
    }

    removeRemainingPlaceholders() {
        let ocupped = this.getOccupedPlaceholders().length
        while (this.placeholders.length > ocupped + 3) {
            this.placeholders.pop()
            $('.placeholder').last().remove()
        }
        this.updatePlaceholderElements()
    }
    
    updatePlaceholderElements() {
        $('.block.placeholder').each((idx, elm) => {
            this.placeholders[idx].setElm($(elm))
        })
    }

    updatePiecesElements(){
        const elements = $('.block.piece.dragged')
        const pieces = this.getSnappedPieces()
        const sameLength = elements.length === pieces.length
        
        if(sameLength)
        {
            // debugger
            elements.each((idx, elm) => {
                this.pieces[idx].setElm($(elm), this.scroll)
            })
        }
    }

    getOrCreatePlaceholder(side, placeholderIndex) {
        if (!this.placeholders[placeholderIndex + side]) {
            let newPlacehoder = this.createPlaceholder(side)
            return newPlacehoder
        }
        return this.placeholders[placeholderIndex + side]
    }

    moveSnapedPieceIfIsTimeToSnap(movingPiece) {
        if (this.isTimeToSnap)
            this.moveSnapedPiece(movingPiece)
    }

    moveSnapedPiece(movingPiece) {
        this.placeholders.forEach((placeholder, placeholderIndex) => {
            this.ifHasPieceThenMove(placeholder, placeholderIndex, movingPiece)
        })
    }

    ifHasPieceThenMove(placeholder, placeholderIndex, movingPiece) {
        if (!placeholder.empty() && placeholder.contains(movingPiece.center(this.scroll))) {
            let moveSide = this.calcMoveSide(placeholder, placeholderIndex, movingPiece)
            this.movePlaceholderPiece(placeholder, moveSide)
        }
    }

    calcMoveSide(placeholder, placeholderIndex, movingPiece) {
        if (placeholderIndex == 0) {
            return Rectangle.prototype.RIGHT
        }
        if (placeholderIndex == this.placeholders.length - 1) {
            return Rectangle.prototype.LEFT
        }

        let commingSide = placeholder.sideOf(movingPiece.center())
        if (commingSide === Rectangle.prototype.LEFT) {
            if (this.placeholders[placeholderIndex - 1].empty()) {
                return Rectangle.prototype.LEFT
            }
            if (this.placeholders[placeholderIndex + 1].empty()) {
                return Rectangle.prototype.RIGHT
            }
        }
        if (commingSide === Rectangle.prototype.RIGHT) {
            if (this.placeholders[placeholderIndex + 1].empty()) {
                return Rectangle.prototype.RIGHT
            }
            if (this.placeholders[placeholderIndex - 1].empty()) {
                return Rectangle.prototype.LEFT
            }
        }
        return Rectangle.prototype.RIGHT
    }

    movePlaceholderPiece(placeholder, moveThisPieceToSide) {
        let placeholderIndex = this.placeholders.indexOf(placeholder)
        let placeholdeToGo = this.getOrCreatePlaceholder(moveThisPieceToSide, placeholderIndex)
        if (!placeholdeToGo.empty()) {
            this.movePlaceholderPiece(placeholdeToGo, moveThisPieceToSide)
        }
        this.snap(placeholdeToGo, placeholder.internalRectangle)
        placeholder.frees()
    }

    setCommands(commands) {
        /** The expected behaviour is that commands arrived
         * from RoPE will have 
         * a) one more command than this number of pieces (user clickes RoPE's buttons)
         * b) none command (the commands are cleared)
         * 
         * The first n - 1 commands must be equal in RoPE and here.
         * If this is false, than remove all pieces from here
         * and syncronize.
         * If true just add the new RoPE's command on this list.
         */

        const snappedPieces = this.getSnappedPieces()

        if (this.syncronized(snappedPieces, commands.slice(0, -1))) {
            this.addPieceFrom(commands[commands.length - 1])
        } else {
            this.removeSnappedPieces()
            this.removeRemainingPlaceholders()
            this.hideHighlight()
            commands.forEach((command) => this.addPieceFrom(command))
        }

        this.getSnappedPieces().forEach(p=>p.setDragged())
    }

    syncronized(pieces, commands) {
        if (pieces.length != commands.length)
            return false
        for (let i = 0; i < commands.length; i++) {
            const command = commands[i]
            if (!pieces[i].$elm.hasClass(command)) {
                return false
            }
        }
        return true
    }

    addPieceFrom(command) {
        const piece = this.cloneAndCreatePiece($('.available.piece.' + command))
        const placeholder = this.getFreePlaceholders()[0]
        
        this.snap(placeholder, piece)

        this.addRightPlaceholder()
        this.movePiecesToLeft()
    }

    removeSnappedPieces() {
        this.getOccupedPlaceholders().forEach((placeholder) => {
            placeholder.internalRectangle.$elm.remove()
            placeholder.frees()
        })
    }

    highlightSnapped() {
        this.getSnappedPieces().forEach(piece => {
            piece.$elm.css('z-index', 10)
        })
    }

    hideHighlight() {
        this.highlightPiece.$elm.fadeOut(400)
    }

    disableDragging() {
        $('.ui-draggable').draggable('disable')
    }

    enableDragging() {
        $('.ui-draggable-handle').draggable('enable')
    }

    highlight({ index }) {
        const placeholder = this.getOccupedPlaceholders()[index]
        if (!placeholder)
            return
        const piece = placeholder.internalRectangle
        this.highlightPiece.moveTo(piece.$elm)
        this.highlightPiece.$elm.fadeIn(100)
        this.scrollToShow(piece)
        this.highlightPiece.index = index
    }

    removePiece(piece) {
        piece.disappear()
        piece = undefined
    }

    on(event, callback) {
        if (!this.callbacks[event]) {
            this.callbacks[event] = []
        }
        this.callbacks[event].push(callback)
    }

    notify(event, param) {
        if(this.callbacks[event])
        {
            this.callbacks[event].forEach(callback => callback.call(this, param))
        }
    }

    notifyChangedPiecesIfChanged() {
        if( this.getPiecesIdsString() != this.startDragPiecesIds ){
            const pieces = this.getSnappedPieces()
            this.notify('changed', pieces)   
        }
    }

    notifyClickedPiece(e) {
        const id = e.currentTarget.id
        const placeholder = this.getOccupedPlaceholders().find(p => p.internalRectangle.id() == id)
        const clickedIndex = this.placeholders.indexOf(placeholder)
        this.notify('click', clickedIndex)
    }

    changeStartDraggingPosition(e) {
        const $elm = $(e.currentTarget)

        if($elm.css('position') !== 'absolute'){
            const scroll = Math.abs(this.$placeholdersArea.offset().left)
            const left = $elm.offset().left + scroll
            const top = $elm.offset().top
            
            $elm.css({
                position: 'absolute',
                left,
                top
            })
        }
    }

    pointToIndex(index) {
        const placeholder = this.getOccupedPlaceholders()[index]
        if (!placeholder) return
        const x = placeholder.getX()
        const $pointer = $('#pointer')
        const rect = new Rectangle($pointer)
        const point = new Point(x, placeholder.y + 60)
        rect.moveTo(point)
        $pointer.fadeIn(400)
        this.scrollToShow(placeholder)
    }

    scrollToShow(rectangle) {
        debugger
        const scroll = $('html').scrollLeft()
        const maxX = rectangle.getX() + rectangle.getWidth()
        const windowWidth = $(window).width()

        if (maxX > (windowWidth + scroll)) {
            const scrollNeeded = (maxX - windowWidth)
            this.scrollTo(scrollNeeded + 50)
        } else if (scroll > rectangle.getX()) {
            this.scrollTo(rectangle.getX() - 50)
        }
    }

    scrollTo(position) {
        $('html').animate({
            scrollLeft: position
        }, 400);
    }

    hidePointer() {
        $('#pointer').fadeOut(400)
    }
}
