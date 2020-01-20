<template>
  <div class="container">
    <rope @click.native="search" :state="ropeState" :class="ropeState" />
    <div id="handWrapper">
      <img id="hand" @click="search" :style="{ opacity: showHand ? 1 : 0 }" src="~/assets/hand.svg"/>
    </div>
  </div>
</template>

<script>
import rope from "~/components/RoPE";

export default {
  components: {
    rope
  },
  data() {
    return {
      ropeState: "sleeping",
      showHand: false
    };
  },
  methods: {
    async search() {
      this.ropeState = "searching";
      this.showHand = false
      try {
        await this.$rope.search();
        this.goToProgrammingPageIfConnected();
      } finally {
        this.setSleepingState();
      }
    },
    goToProgrammingPageIfConnected() {
      if (this.$rope.isConnected()) {
        this.$router.push("/programming");
      }
    },
    setSleepingState() {
      if (!this.$rope.isConnected()) {
        this.ropeState = "sleeping";
        this.showHand = true
      }
    },
    setHandVisible(delay) {
      if(this.ropeState == 'sleeping'){
        setTimeout(()=>{
          this.showHand = true
        }, delay)
      }
    }
  },
  mounted() {
    const delay = 4000
    this.setHandVisible(delay)
  }
};
</script>

<style scoped lang="scss">
$backgroundColor: #7eb3ae5d;
$buttonSize: 100px;

.container {
  height: 100vh;
  display: flex;
  flex-flow: column;
  align-items: center;
  justify-content: center;
  background: $backgroundColor;

  .sleeping {
    cursor: pointer;
  }

  #handWrapper {
    height: 100px;
    #hand {
      opacity: 0;
      transition: opacity 1s;
      animation: upDown 4s infinite cubic-bezier(0.175, 0.885, 0.32, 1.275);
    }
  }

  @keyframes upDown {
    $deslocation: 10px;
    0% {
      margin-bottom: $deslocation;
    }
    50% {
      margin-top: $deslocation;
    }
    100% {
      margin-bottom: $deslocation;
    }
  }
}
</style>
