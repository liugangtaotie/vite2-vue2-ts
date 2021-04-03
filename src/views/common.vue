<template>
  <div class="app" style="height: 100vh; overflow-x: hidden; background-color: #f2f2f2">
    <!--内容模块-->
    <section class="section_content_model">页面正在开发中...</section>
  </div>
</template>

<script lang="ts">
import { Component, Vue } from "vue-property-decorator";
import BsFooter from "@COM/BsFooter/index.vue";
import apiObj from "@API/main";
import BsDialog from "@COM/BsDialog/index.vue";
import { isObjectValueEqual } from "@API/util";

@Component({
  name: "CommonModel",
  components: { BsFooter, BsDialog },
})
export default class CommonModel extends Vue {}
</script>

<style lang='less' scoped>
.section_content_model {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 100%;
  height: 100vh;
  margin-top: 50px;
  font-size: 25px;
}
</style>
