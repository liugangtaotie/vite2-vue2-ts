<template>
  <div class="home-model tcenter">
    <div class="total-model" :style="{ height: contentHeight }">
      <div @click="onClickContent" class="content-model">
        <div class="mt20">111111111</div>
        <div class="mt20">111111111</div>
        <div class="mt20">111111111</div>
        <div class="mt20">111111111</div>
        <div class="mt20">111111111</div>
        <div class="mt20">111111111</div>
        <div class="mt20">111111111</div>
        <div class="mt20">111111111</div>
        <div class="mt20">111111111</div>
        <div class="mt20">111111111</div>
        <div class="mt20">111111111</div>
        <div class="mt20">111111111</div>
        <div class="mt20">111111111</div>
        <div class="mt20">111111111</div>
        <div class="mt20">111111111</div>
        <div class="mt20">111111111</div>
        <div class="mt20">111111111</div>
        <div class="mt20">111111111</div>
        <div class="mt20">111111111</div>
        <div class="mt20">111111111</div>
        <div class="mt20">111111111</div>
        <div class="mt20">111111111</div>
        <div class="mt20">111111111</div>
        <div class="mt20">111111111</div>
        <div class="mt20">111111111</div>
        <div class="mt20">111111111</div>
        <div class="mt20">111111111</div>
        <div class="mt20">111111111</div>
        <div class="mt20">111111111</div>
        <div class="mt20">111111111</div>
      </div>

      <!-- <van-popup v-model="bottomVisible" position="bottom">
        <div class="m20">
          <div class="mt20">222222222</div>
          <div class="mt20">222222222</div>
          <div class="mt20">222222222</div>
          <div class="mt20">222222222</div>
        </div>
      </van-popup> -->

      <div v-if="bottomVisible" class="bottom-model">
        <div class="m20">
          <div class="mt20">222222222</div>
          <div class="mt20">222222222</div>
          <div class="mt20">222222222</div>
          <div class="mt20">222222222</div>
        </div>
      </div>
    </div>
    <!-- <van-tabs v-model="activeTab">
      <van-tab v-for="index in 4" :title="'tab' + index" :key="index">
        content of tab {{ index }}
      </van-tab>
    </van-tabs>
    <div class="single">tabTwo</div>
    <div class="single">tabTwo</div>
    <div class="single">tabTwo</div>
    <div class="single">tabTwo</div>
    <div class="single">tabTwo</div>
    <div class="single">tabTwo</div>
    <div class="single">tabTwo</div>
    <div class="single">tabTwo</div>
    <div class="single">tabTwo</div>
    <div class="single">tabTwo</div>
    <div class="single">tabTwo</div> -->

    <!-- <my-footer :active="1"></my-footer> -->
  </div>
</template>

<script lang="ts">
import { Component, Vue } from "vue-property-decorator";

@Component({
  name: "TabTwo",
})
export default class TabTwo extends Vue {
  private activeTab = 0;
  private bottomVisible = false;

  get contentHeight() {
    const height = Number(this.getWindowHeight(top)) + Number(this.getWindowScrollTop(top)); //此处的40是class为bottom的div元素高
    return height + "px";
  }

  /**滚动条高**/
  getWindowScrollTop(win) {
    let scrollTop = 0;
    if (win.document.documentElement && win.document.documentElement.scrollTop) {
      scrollTop = win.document.documentElement.scrollTop;
    } else if (win.document.body) {
      scrollTop = win.document.body.scrollTop;
      return scrollTop;
    }
    return scrollTop;
  }

  /**获取**/
  getWindowHeight(win) {
    var clientHeight = 0;
    if (win.document.body.clientHeight && win.document.documentElement.clientHeight) {
      clientHeight =
        win.document.body.clientHeight < win.document.documentElement.clientHeight
          ? win.document.body.clientHeight
          : win.document.documentElement.clientHeight;
    } else {
      clientHeight =
        win.document.body.clientHeight > win.document.documentElement.clientHeight
          ? win.document.body.clientHeight
          : win.document.documentElement.clientHeight;
    }
    return clientHeight;
  }

  onClickContent() {
    this.bottomVisible = !this.bottomVisible;
  }
}
</script>

<style lang='less' scoped>
.total-model {
  position: relative;
  overflow-y: scroll;
}

.content-model {
  width: 100%;
  height: auto;
}

// .bottom-model {
//   position: absolute;
//   bottom: 0;
//   left: 0;
// }

.bottom-model {
  position: sticky;
  bottom: 0;
  left: 0;
  overflow: hidden;
  background-color: #999;
}

.home-model {
  width: 100%;
  height: 100vh;
  // padding: 10px;
}

.single {
  width: 100%;
  height: 50px;
  margin-top: 20px;
}
</style>
