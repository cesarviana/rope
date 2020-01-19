<template>
  <div class="container">
    <rope @click.native="search" :state="ropeState" />
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
      ropeState: "sleeping"
    };
  },
  methods: {
    async search() {
      this.ropeState = "searching";
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
      }
    }
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
}
</style>
