<template>
  <div class="home-model tcenter">
    <van-notice-bar
      text="Technology is the common soul of the people who developed it."
      left-icon="volume-o"
    />
    <van-swipe class="my-swipe" :autoplay="3000" indicator-color="white">
      <van-swipe-item>1</van-swipe-item>
      <van-swipe-item>2</van-swipe-item>
      <van-swipe-item>3</van-swipe-item>
      <van-swipe-item>4</van-swipe-item>
    </van-swipe>
    <van-divider />
    <van-button class="flex mt10" type="primary" @click="$router.push('/about')"
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
  padding: 10px;
}

.my-swipe .van-swipe-item {
  font-size: 20px;
  line-height: 150px;
  color: #fff;
  text-align: center;
  background-color: #39a9ed;
}

.single {
  width: 100%;
  height: 30px;
  margin-top: 20px;
}
</style>
















