<template>
  <div class="home-model tcenter">
    <van-button class="flex" type="primary" @click="$router.push('/about')"
      >home,点击跳转about</van-button
    >
    <div class="single">home</div>
    <div class="single">home</div>
    <div class="single">home</div>
    <div class="single">home</div>
    <div class="single">home</div>
  </div>
</template>

<script lang="ts">
import { Component, Vue } from "vue-property-decorator";
// import BsDialog from "@COM/BsDialog/index.vue";

@Component({
  name: "Home",
  // components: { BsDialog },
})
export default class Home extends Vue {
  private signToShow: Boolean = false; //

  created() {}

  mounted() {}
}
</script>

<style lang='less' scoped>
.home-model {
  width: 100%;
  height: 100vh;
  margin-top: 50px;
}

.single {
  width: 100%;
  height: 30px;
  margin-top: 20px;
}
</style>
















