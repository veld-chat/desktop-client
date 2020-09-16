<template>
  <div :class="['modal', open && 'open']">
    <div class="modal-container">
      <div class="modal-header">
        <div class="modal-close" @click.prevent="closeModal">
          <i class="fas fa-times" />
        </div>
      </div>
      <div class="modal-content">
        <slot />
      </div>
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
