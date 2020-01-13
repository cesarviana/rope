<template>
  <svg>
    <g
      style="stroke-width:0.7778272"
      transform="matrix(1.284595,0,0,1.286671,-10.344103,-27.760194)"
      id="connectingSignal"
    >
      <ellipse
        v-if="visible(1)"
        class="signal"
        style="stroke-width:1"
        cx="41.178417"
        cy="59.770172"
        rx="2.8370967"
        ry="2.6749768"
      />
      <g
        id="g2392"
        transform="matrix(-0.06526264,0.21797422,-0.21797422,-0.06526264,101.12087,-10.059415)"
      >
        <path
          v-if="visible(2)"
          class="signal"
          d="m 341.333,162.573 c 0,-8.555 3.328,-16.576 9.365,-22.635 4.16,-4.16 4.16,-10.923 0,-15.083 -4.16,-4.16 -10.923,-4.16 -15.083,0 -10.068,10.07 -15.615,23.468 -15.615,37.718 0,14.251 5.547,27.648 15.616,37.717 2.091,2.069 4.821,3.115 7.552,3.115 2.731,0 5.461,-1.024 7.531,-3.115 4.16,-4.16 4.16,-10.923 0,-15.083 -6.038,-6.058 -9.366,-14.079 -9.366,-22.634 z"
          id="signal2"
        />
      </g>
      <g
        id="g2404"
        transform="matrix(-0.06526264,0.21797422,-0.21797422,-0.06526264,101.12087,-10.059415)"
      >
        <path
          v-if="visible(3)"
          class="signal"
          d="m 320.512,109.795 c 4.16,-4.16 4.16,-10.923 0,-15.083 -4.16,-4.16 -10.923,-4.16 -15.083,0 -37.419,37.44 -37.419,98.325 0,135.765 2.091,2.069 4.821,3.115 7.552,3.115 2.731,0 5.461,-1.045 7.531,-3.115 4.16,-4.16 4.16,-10.923 0,-15.083 -29.099,-29.119 -29.099,-76.479 0,-105.599 z"
          id="signal3"
        />
      </g>
      <g
        id="g2416"
        transform="matrix(-0.06526264,0.21797422,-0.21797422,-0.06526264,101.12087,-10.059415)"
      >
        <path
          v-if="visible(4)"
          class="signal"
          d="m 290.347,79.629 c 4.16,-4.16 4.16,-10.923 0,-15.083 -4.16,-4.16 -10.923,-4.16 -15.083,0 -54.059,54.059 -54.059,142.037 0,196.096 2.091,2.069 4.821,3.115 7.552,3.115 2.731,0 5.461,-1.045 7.531,-3.115 4.16,-4.16 4.16,-10.923 0,-15.083 -45.76,-45.738 -45.76,-120.17 0,-165.93 z"
          id="signal4"
        />
      </g>
    </g>
  </svg>
</template>

<script>
const SIGNAL_STICKS = 7;
const SIGNALS_DISTANCE_TO_SHOW = 2;
export default {
  name: "ConnectingSignal",
  data() {
    return {
      visibleStick: 0
    }
  },
  mounted() {
    setInterval(()=>{
      this.visibleStick++
      if(this.visibleStick > SIGNAL_STICKS){
        this.visibleStick = 0
      }
    }, 200)
  },
  methods: {
    visible(stick) {
      const distance = Math.abs(stick - this.visibleStick)
      return distance < SIGNALS_DISTANCE_TO_SHOW
    }
  }
};
</script>

<style lang="scss">

.signal {
  fill: #2780de;
  stroke: #2b1100;
  stroke-width: 4;
}

</style>