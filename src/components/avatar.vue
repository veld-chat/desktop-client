<template>
  <img
    :class="[
      'image',
      `image-${size || 'normal'}`, 
      'rounded'
    ]"
    :src="src"
  >
</template>
<style lang="scss" scoped>
</style>
<script lang="ts">
import Vue from "vue";

export default class Avatar extends Vue {
  src: string;
  size: "small" | "normal" | "large" = "normal";
  rounded = false;
}
</script>