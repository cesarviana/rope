<template>
  <div class="piece">
    <svg
      width="105"
      height="83"
      viewBox="-1 -1 28 21">
      <defs>
        <filter id="selected-item">
          <feOffset dx="1" dy="1" in="RGB" result="offsetOut"></feOffset>
          <feGaussianBlur in="offsetOut" result="blurOut" stdDeviation="0.6"></feGaussianBlur>
          <feColorMatrix in="blurOut" type="luminanceToAlpha" result="luminanceOut"></feColorMatrix>
          <feBlend in="SourceGraphic" in2="blurOut" result="sourceBlend"></feBlend>
          <feOffset in="sourceBlend" dx="-0.8" dy="-0.8"></feOffset>
        </filter>
      </defs>
      <g class="piece-body">
        <path
          class="border"
          transform="translate(-6.1832128,-9.0501561)"
          :class="[command, state]"
          d="m 6.2396572,24.43389 v -4.07864 l 0.446231,-0.0414 c 0.53832,-0.05 0.824534,0.0114 1.293128,0.27723 1.174375,0.66629 2.5288458,0.23195 3.0685308,-0.98401 0.15997,-0.36043 0.141064,-1.09248 -0.03862,-1.49532 -0.316709,-0.71004 -0.973717,-1.16278 -1.7613458,-1.21372 -0.467231,-0.0302 -0.688122,0.0264 -1.85103,0.47461 -0.284057,0.10948 -0.619038,0.13282 -0.950305,0.0662 l -0.206589,-0.0415 V 13.25197 9.1066005 h 10.1806688 10.18067 v 4.2201295 4.22014 h 0.53667 c 0.48549,0 0.5935,-0.0257 1.13288,-0.26989 0.32792,-0.14843 0.75087,-0.30111 0.9399,-0.33928 0.94872,-0.19153 2.03529,0.48686 2.28895,1.4291 0.18279,0.67903 -0.0806,1.541 -0.61,1.99658 -0.63491,0.54635 -1.60811,0.66335 -2.27998,0.27414 -0.71513,-0.41429 -0.76719,-0.43232 -1.24562,-0.43139 -0.25592,0 -0.53224,0.0189 -0.61405,0.041 l -0.14875,0.0401 v 4.11269 4.1127 H 16.420326 6.2396572 Z"></path>
        <path
          class="arrow"
          :class="state"
          style="stroke-width:0.4px;stroke-linecap:butt;stroke-linejoin:miter;stroke-opacity:1"
          :d="d[command]"></path>
      </g>
    </svg>
  </div>
</template>

<script>
  export default {
    name: 'Piece',
    props: {
      command: {
        required: true,
        type: String,
        default: 'forward'
      },
      state: {
        required: false,
        type: String,
        default: 'default'
      }
    },
    data() {
      return {
        d: {
          forward: 'm 12,4.5 -4.5987,4.86266 3.0344,-0.0376 0.08,6.03517 2.9803,0.002 0.067,-5.98358 3.0801,0.0106 z',
          backward: 'm 12,15.5 -4.5987,-4.86265 3.0344,0.0375 0.08,-6.03514 2.9803,-0.002 0.067,5.98358 3.0801,-0.009 z',
          right: 'm 8,8 c -1.3098,1.68172 -1.3585,3.62957 0.8673,5.86129 2.7202,2.72747 5.7976,1.32074 6.057,1.08177 -2.781,-0.29276 -4.0303,-1.04623 -5.0191,-2.03767 -0.9892,-0.99193 -0.7047,-2.20408 0.074,-2.92102 0.519,-0.47796 1.2846,-0.70854 2.5457,-0.44242 l -0.074,2.92102 4.6707,-4.30158 -4.451,-4.46297 -0.074,2.92102 c -1.2611,-0.26613 -3.5468,-0.0622 -4.597,1.38056 z',
          left: 'm 15.5,8 c 1.3098,1.68172 1.3585,3.62957 -0.8673,5.86129 -2.7202,2.72747 -5.7976,1.32074 -6.057,1.08177 2.781,-0.29276 4.0303,-1.04623 5.0191,-2.03767 0.9892,-0.99193 0.7047,-2.20408 -0.074,-2.92102 -0.519,-0.47796 -1.2846,-0.70854 -2.5457,-0.44242 l 0.074,2.92102 -4.6707,-4.30158 4.451,-4.46297 0.074,2.92102 c 1.2611,-0.26613 3.5468,-0.0622 4.597,1.38056 z'
        }
      }
    }
  }
</script>

<style lang="scss" scoped>

  .piece:active {
    $overOtherPieces: 100;
    z-index: $overOtherPieces;
  }

  .piece-body:hover {
    cursor: move;
  }

  .piece-body:active {
    cursor: grabbing;
    filter: url(#selected-item);
    transform: rotate(-1grad);
  }

  .piece-body {
    $highlightedColor: rgb(70, 255, 255);
    .border.default {
      stroke:#241c1c;
      stroke-width:0.7;
    }

    .border.highlighted {
      stroke: $highlightedColor;
      stroke-width:1;
    }

    .arrow.default {
      fill: white;
      stroke: black;
    }

    .arrow.highlighted {
      fill: $highlightedColor;
      stroke: $highlightedColor;
    }
  }

  .forward {
    fill: #66c9fc;
  }

  .backward {
    fill: #ff8300;
  }

  .left {
    fill: #ff685e;
  }

  .right {
    fill: #ffe46b;
  }
</style>
