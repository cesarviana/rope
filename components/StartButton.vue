<template>
  <div>
    <svg
      viewBox="0 0 23.784723 23.010496"
      height="70"
      width="70"
      @click="toggleActive"
    >
      <g
        transform="translate(-220.68502,-315.73285)"
        id="layer1">
        <path
          :class="{ active: active }"
          style="stroke:#241c1c;stroke-width:0.5"
          d="m 243.38484,327.11993 a 11.26392,11.302183 0 0 1 -11.26392,11.30218 11.26392,11.302183 0 0 1 -11.26394,-11.30218 11.26392,11.302183 0 0 1 11.26394,-11.30218 11.26392,11.302183 0 0 1 11.26392,11.30218 z"
          id="circle">
        </path>
        <path
          style="stroke:#241c1c;stroke-width:1.0"
          d="m 236.66137,334.39857 -4.65889,-2.67425 -4.79431,2.41066 1.04611,-5.35981 -3.72231,-3.9203 5.30544,-0.63833 2.4938,-4.83356 2.2328,4.96536 5.26359,0.933 -3.92549,3.70705 z"
          id="start">
        </path>
      </g>
    </svg>
  </div>
</template>

<script>
  export default {
    name: "StartButton",
    data() {
      return {
        active: false
      }
    },
    methods: {
      toggleActive() {
        this.active = !this.active
      }
    }
  }
</script>

<style scoped lang="scss">
  div {

    :not(.active) {
      fill: #9cce31;
    }

    .active {
      fill: saddlebrown;
    }
  }
</style>
