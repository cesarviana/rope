<template>
  <div class="container">
    <div>
      <rope :slepping="connectionFailed"/>
    </div>
    <hr>
    <div>
      <hr>
      <button @click="search">Conectar</button>
    </div>
  </div>
</template>

<script>
  import rope from '~/components/RoPE'

  export default {
    components: {
      rope
    },
    data(){
      return {
        connectionFailed: false
      }
    },
    methods: {
      async search() {
        try {
          await this.$rope.search();
          this.$router.push('/programming')
        } catch (e) {
          this.connectionFailed = true;
          console.error(e)
        }
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
    justify-content: space-between;
    align-items: center;
    background: #f2f2f2;

    div {
      flex-grow: 1;
      display: flex;
      justify-content: center;
      align-items: center;
    }

    div:last-of-type {
      width: 100%;
      background: #f2f2f2;
    }
  }

</style>
