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

    <SvgIcon name="moon"></SvgIcon>

    <van-divider />

    <van-button class="flex mt10" type="primary" @click="$router.push('/about')"
      >home,点击跳转about</van-button
    >
    <div class="flex flex_center single">
      store的count数据 <span class="ml20 f30 t2">{{ $store.state.moduleMain.count }}</span>
    </div>
    <van-button class="flex mt10" type="primary" @click="onClickAdd">add +</van-button>
    <van-button class="flex mt10" type="primary" @click="onClickSub">dec -</van-button>

    <MyFooter :active="0"></MyFooter>
  </div>
</template>

<script lang="ts">
import { Component, Vue } from "vue-property-decorator";
import MyFooter from "@/components/MyFooter.vue";
import SvgIcon from "@/components/SvgIcon.vue";

@Component({
  name: "Home",
  components: { MyFooter, SvgIcon },
})
export default class Home extends Vue {
  private signToShow: Boolean = false; //
  private num: number = 0;
  private active: number = 0;
  private activeTab: number = 0;

  created() {}

  mounted() {
    this.num = this.$store.state.moduleMain.count;

    this.login();
  }

  onClickAdd() {
    this.$store.commit("moduleMain/increment");
  }

  onClickSub() {
    this.$store.commit("moduleMain/subtraction");
  }

  login() {
    var options = {
      user: "zd2",
      pwd: "1",
      appKey: "easemob-demo#easeim",
    };
  }
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
  background-color: #07c160;
}

.single {
  width: 100%;
  height: 50px;
  margin-top: 20px;
}
</style>
















