<template>
  <div>
    <svg
      viewBox="0 0 25 25"
      height="72"
      width="72"
      @click="execute"
    >
      <g
        transform="translate(-219,-314)"
        id="layer1">
        <path
          :class="state"
          style="stroke:#241c1c;stroke-width:1"
          d="m 243.38484,327.11993 a 11.26392,11.302183 0 0 1 -11.26392,11.30218 11.26392,11.302183 0 0 1 -11.26394,-11.30218 11.26392,11.302183 0 0 1 11.26394,-11.30218 11.26392,11.302183 0 0 1 11.26392,11.30218 z"
          id="circle">
        </path>
        <path
          :class="state"
          style="stroke:#241c1c;stroke-width:1.0"
          d="m 236.66137,334.39857 -4.65889,-2.67425 -4.79431,2.41066 1.04611,-5.35981 -3.72231,-3.9203 5.30544,-0.63833 2.4938,-4.83356 2.2328,4.96536 5.26359,0.933 -3.92549,3.70705 z"
          id="star">
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
    props: {
      disabled: {
        type: Boolean,
        default: true
      }
    },
    mounted() {
      this.$rope.onExecutionStopped(()=>{
        this.active = false
      })
    },
    methods: {
      execute() {
        if(this.enabled){
          this.active = true
          this.$rope.execute()
        }
      }
    },
    computed: {
      state() {
        if(this.disabled){
          return 'disabled'
        }
        if(this.active){
          return 'active'
        }
      },
      enabled() {
        return !this.disabled
      }
    }
  }
</script>

<style scoped lang="scss">
  div {

    :not(.active), #star.active {
      fill: #9cce31;
    }

    .disabled {
      fill: #6aa36d;
    }

    .active {
      fill: #52b960
    }

    path {
      transition: fill .5s
    }
  }
</style>
