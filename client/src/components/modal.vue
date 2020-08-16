<template>
  <div :class="['modal', open && 'open']">
    <div class="modal-close" @click.prevent="closeModal">
      <i class="fas fa-times"></i>
    </div>
    <div class="modal-content">
      <slot />
    </div>
  </div>
</template>
<script lang="ts">
import Vue from "vue";
import Component from "vue-class-component";
import { Prop } from "vue-property-decorator";

@Component
export default class Modal extends Vue {
  @Prop() open;

  closeModal() {
    this.$emit("close");
  }
}
</script>
