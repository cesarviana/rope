<template>
  <div class="container" :class="{executing}">
    <div class="dragging">
      <draggable v-model="pieces"
                 id="pieces"
                 ghost-class="ghost"
                 easing="cubic-bezier(0.5, 0, 0, 1)"
                 animation="150"
                 group="shared"
                 :onSpill="onSpill"
                 :disabled="executing"
                 remove-on-spill="true"
                 :style="{ 'min-width': Math.max(3, pieces.length + 1) * 78 + 'px'}"
      >
        <piece v-for="piece in pieces" :key="piece.id" :command="piece.command" :state="piece.state"></piece>
      </draggable>
    </div>
    <div class="available">
      <rope v-if="clicksOnRoPE < 10" @click.native="clicksOnRoPE++"/>
      <draggable
        v-model="availablePieces"
        :clone="clone"
        style="display:flex; justify-content: space-around"
        :direction="'horizontal'"
        :sort="false"
        :group="{ name: 'shared', pull: 'clone', put: false }"
      >
        <piece v-for="piece in availablePieces" :key="piece.id" :command="piece.command" />
      </draggable>
      <start-button :disabled="noPieces" @click="execute"/>
    </div>
    <div id="shadow"></div>
  </div>
</template>

<script>
  import draggable from 'vuedraggable'
  import rope from '~/components/RoPE'
  import startButton from '~/components/StartButton'
  import piece from '~/components/Piece'

  import snapSoundPath from '~/assets/snapsound.mp3'
  import startSoundPath from '~/assets/startsound.wav'
  import stopSoundPath from '~/assets/stopsound.wav'
  
  const commands = {
    FORWARD: 'forward',
    BACKWARD: 'backward',
    LEFT: 'left',
    RIGHT: 'right'
  };

  let snapSound, startSound, stopSound = undefined

  export default {
    components: {
      draggable, rope, piece, startButton
    },
    data() {
      return {
        availablePieces: [
          {id: 0, command: commands.FORWARD},
          {id: 1, command: commands.BACKWARD},
          {id: 2, command: commands.LEFT},
          {id: 3, command: commands.RIGHT}
        ],
        pieces: [],
        maxId: 3,
        executing: false,
        clicksOnRoPE: 0
      }
    },
    mounted() {
      
      if(!this.$rope.isConnected()){
        this.goToFirstPage()
      }
      
      this.$rope.onConnectionFailed(()=>{
        this.goToFirstPage()
      })

      this.$rope.onExecutionStarted(_=>{
        if(this.pieces[0]){
          this.pieces[0].state = 'highlighted'
          this.executing = true
          startSound.play()
          this.$forceUpdate()
          this.$nextTick(this.scrollToCurrentPiece)
        }
      })
      
      this.$rope.onExecutedInstruction(index=>{
        if(this.pieces[index]){
          this.pieces[index].state = 'default'
        }
        if(this.pieces[index+1]){
          this.pieces[index+1].state = 'highlighted'
        }
        this.$forceUpdate()

        this.scrollToCurrentPiece()

      })
      
      this.$rope.onExecutionStopped(_=>{
        this.pieces = []
        this.executing = false
        stopSound.play()
      })

      this.$rope.onAddedInstruction(command=>{
        const piece = this.newPieceFor(command)
        piece.originatedInRoPE = true
        this.pieces.push(piece)
      })
      
      snapSound = new Audio(snapSoundPath)
      startSound = new Audio(startSoundPath)
      stopSound = new Audio(stopSoundPath)
    },
    methods: {
      goToFirstPage() {
        this.$router.push('/?connectionFailed=true')
      },
      clone(piece) {
        return this.newPieceFor(piece.command)
      },
      newPieceFor(command){
        return {
          id: ++this.maxId, 
          command
        }
      },
      onSpill(event){
        const pieceIndex = event.oldDraggableIndex
        this.removePiece(pieceIndex)
      },
      removePiece(pieceIndex) {
        this.pieces.splice(pieceIndex, 1)
      },
      execute() {
        this.$rope.execute(this.commands)
      },
      scrollToCurrentPiece(){
        const highlightedPiece = document.getElementsByClassName('highlighted')[0]
        
        if(!highlightedPiece) return

        const draggingArea = document.getElementsByClassName('dragging')[0]
        const margin = 200
        const pieceIsRight = highlightedPiece.offsetLeft + margin > (window.innerWidth + draggingArea.scrollLeft)
        const pieceIsLeft = highlightedPiece.offsetLeft < draggingArea.scrollLeft
        if( pieceIsRight || pieceIsLeft ) {
          draggingArea.scrollTo( highlightedPiece.offsetLeft, 0)
        }
      }
    },
    watch: {
      pieces: function(newPieces, oldPieces){
        
        if(this.hasPieces && !this.lastPiece.originatedInRoPE){
          this.$rope.sendCommands(this.commands)
        }
        
        const pieceAddedOrMoved = newPieces.length >= oldPieces.length
        if(pieceAddedOrMoved){
          snapSound.play()
        }
      }
    },
    computed: {
      noPieces(){
        return this.pieces.length == 0
      },
      hasPieces(){
        return !this.noPieces
      },
      commands() {
        return this.pieces.map(piece => piece.command)
      },
      lastPiece() {
        if(this.hasPieces) {
          return this.pieces[this.pieces.length - 1]
        }
        return undefined
      }
    }
  }
</script>

<style scoped lang="scss">

  $spacingDefault: 20px;
  $pieceWidth: 78px;

  .container {
    height: 100vh;
    display: flex;
    flex-flow: column;

    .dragging {
      flex-grow: 1;
      display: flex;
      align-items: center;
      overflow-y: hidden;
      border: 1px solid white;
      padding: $spacingDefault;

      #pieces {
        margin: 0 auto;
        display: flex;
        min-height: $pieceWidth;
        min-width: $pieceWidth * 4;
        background-image: url('~assets/placeholder.svg');
        background-size: $pieceWidth;
        background-repeat: repeat-x;
        background-position-y: center;

        div.piece {
          width: $pieceWidth;
        }

        .ghost {
          visibility: hidden;
        }
      }

    }

    .piece:active {
      animation-name: rotate;
      animation-duration: .5s;
    }

    .available {
      background: #f2f2f2;
      height: 100px;
      width: 100%;
      display: flex;
      flex-flow: row;
      justify-content: space-around;
      align-items: center;
    }
  }

  .executing.container {
    #shadow {
      width: 100%;
      height: 100%;
      position: absolute;
      background: #6d4b4b90;
    }
    .dragging {
      scroll-behavior: smooth;
      #pieces {
        z-index: 2;
        background-image: none;
      }
    }
  }
  

</style>
