<template>
  <svg aria-hidden="true">
    <use :xlink:href="symbolId" />
  </svg>
</template>

<script lang="ts">
import { Component, Prop, Vue } from "vue-property-decorator";

@Component({
  name: "SvgIcon",
})
export default class SvgIcon extends Vue {
  @Prop({ type: String, default: "icon" }) prefix;
  @Prop({ type: String, required: true }) name;

  get symbolId() {
    console.info("11111", `#${this.prefix}-${this.name}`);
    return `#${this.prefix}-${this.name}`;
  }
}
</script>


