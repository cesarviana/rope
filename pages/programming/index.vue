<template>
  <div class="container">
    <div class="dragging">
      <draggable v-model="pieces"
                 id="pieces"
                 ghost-class="ghost"
                 easing="cubic-bezier(0.5, 0, 0, 1)"
                 animation="150"
                 group="shared"
                 :onSpill="onSpill"
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

  let snapSound = undefined

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
        maxId: 3
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
      })
      
      this.$rope.onExecutionStopped(_=>{
        this.pieces = []
      })

      this.$rope.onAddedInstruction(_=>{
        this.pieces.push()
      })

      snapSound = new Audio('/sounds/snapsound.mp3')
    },
    methods: {
      goToFirstPage() {
        this.$router.push('/?connectionFailed=true')
      },
      clone(piece) {
        return {
          id: ++this.maxId,
          command: piece.command
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


</style>
