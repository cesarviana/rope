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
      >
        <piece v-for="piece in pieces" :key="piece.id" :command="piece.command" :state="piece.state"></piece>
      </draggable>
    </div>
    <div class="available">
      <rope/>
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
        pieces: [
          {id: 0, command: commands.FORWARD},
          {id: 1, command: commands.BACKWARD},
          {id: 2, command: commands.LEFT},
          {id: 3, command: commands.RIGHT},
          {id: 10, command: commands.FORWARD},
          {id: 11, command: commands.BACKWARD},
          {id: 12, command: commands.LEFT},
          {id: 13, command: commands.RIGHT},
          {id: 222, command: commands.FORWARD},
          {id: 21, command: commands.BACKWARD},
          {id: 22, command: commands.LEFT},
          {id: 23, command: commands.RIGHT},
          {id: 20, command: commands.FORWARD},
          {id: 31, command: commands.BACKWARD},
          {id: 32, command: commands.LEFT},
          {id: 33, command: commands.RIGHT},
          
          {id: 40, command: commands.FORWARD},
          {id: 41, command: commands.BACKWARD},
          {id: 42, command: commands.LEFT},
          {id: 43, command: commands.RIGHT},
          {id: 410, command: commands.FORWARD},
          {id: 411, command: commands.BACKWARD},
          {id: 412, command: commands.LEFT},
          {id: 413, command: commands.RIGHT},
          {id: 4222, command: commands.FORWARD},
          {id: 421, command: commands.BACKWARD},
          {id: 422, command: commands.LEFT},
          {id: 423, command: commands.RIGHT},
          {id: 420, command: commands.FORWARD},
          {id: 431, command: commands.BACKWARD},
          {id: 432, command: commands.LEFT},
          {id: 433, command: commands.RIGHT}
        ],
        maxId: 3,
        executing: false
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

        this.scrollToCurrentPiece(index)

      })
      
      this.$rope.onExecutionStopped(_=>{
        this.pieces = []
        this.executing = false
        stopSound.play()
      })

      this.$rope.onAddedInstruction(command=>{
        this.addCommand(command)
      })

      snapSound = new Audio('/sounds/snapsound.mp3')
      startSound = new Audio('/sounds/startsound.wav')
      stopSound = new Audio('/sounds/stopsound.wav')
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
      addCommand(command) {
        const piece = this.newPieceFor(command)
        this.pieces.push(piece)
      },
      execute() {
        this.$rope.execute(this.commands)
      },
      scrollToCurrentPiece(pieceIndex){
        const highlightedPiece = document.getElementsByClassName('highlighted')[0]
        const draggingArea = document.getElementsByClassName('dragging')[0]
        const margin = 200
        if( highlightedPiece.offsetLeft + margin > (window.innerWidth + draggingArea.scrollLeft) ) {
          draggingArea.scrollTo( highlightedPiece.offsetLeft, 0)
        }
      }
    },
    watch: {
      pieces: function(newPieces, oldPieces){
        
        /**
         * Send commands just to get feedback for the last command.
         * That way, the child listen, from the robot, the sound of last command.
         * 
         * The complete list of commands is sent when "execute button" is pressed.
         *  */ 
        this.$rope.sendCommands([this.lastCommand])
        
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
      commands() {
        return this.pieces.map(piece => piece.command)
      },
      lastCommand() {
        if(this.commands.length > 0) {
          return this.commands[this.commands.length - 1]
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
        min-width: $pieceWidth * 3.4;
        background-image: url('/placeholder.svg');
        background-size: 80px 100%;
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
