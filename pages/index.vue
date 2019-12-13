<template>
  <div class="container">
    <div class="dragging">
      <draggable id="pieces"
                 :key="pieces.length"
                 ghost-class="ghost"
                 easing="cubic-bezier(0.5, 0, 0, 1)"
                 animation="150"
                 group="shared"
      >
        <piece v-for="piece in pieces" :command="piece.command"></piece>
      </draggable>
    </div>
    <div class="available">
      <rope/>
      <draggable style="display:flex; justify-content: space-around"
                 :key="availablePieces.length"
                 :sort="false"
                 :group="{ name: 'shared', pull: 'clone', put: false }"
      >
        <piece v-for="piece in availablePieces" :command="piece.command"/>
      </draggable>
      <start-button/>
      {{nextId}}
    </div>
  </div>
</template>

<script>
  import draggable from 'vuedraggable'
  import rope from '~/components/RoPE'
  import startButton from '~/components/StartButton'
  import piece from '~/components/Piece'

  const commandTypes = {
    FORWARD: 'forward',
    BACKWARD: 'backward',
    LEFT: 'left',
    RIGHT: 'right'
  };

  export default {
    components: {
      draggable, rope, piece, startButton
    },
    data() {
      return {
        availablePieces: [
          { id: 0, command: commandTypes.FORWARD },
          { id: 1, command: commandTypes.BACKWARD },
          { id: 2, command: commandTypes.LEFT },
          { id: 3, command: commandTypes.RIGHT }
        ],
        pieces: [],
        nextId: 4
      }
    }
  }
</script>

<style scoped lang="scss">

  $spacingDefault: 20px;

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
    }

    .available {
      background: #f2f2f2;
      height: 100px;
      width: 100%;
      display: flex;
      flex-flow: row;
      justify-content: space-around;
      align-items: center;

      div.piece:active {
        animation-name: rotate;
        animation-duration: .5s;
      }

      @keyframes rotate {
        0% { transform: rotate(0deg); }
        25% { transform: rotate(10deg); }
      }
    }
  }

  #pieces {
    margin: 0 auto;
    display: flex;
    border: 1px solid blue;
    min-width: 100px;
    min-height: 100px;

    div.piece {
      width: 83px;
    }

    .ghost {
      visibility: hidden;
    }
  }

</style>
