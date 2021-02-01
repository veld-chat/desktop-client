<template>
  <div class="settings">
    <div class="settings-sidebar">
      <div class="settings-sidebar-inner">
        <slot name="sidebar" />
      </div>
    </div>
    <div class="settings-container">
      <div class="settings-container-inner">
        <slot />
      </div>
      <g-link
        to="/"
        class="settings-close"
      >
        &times;
      </g-link>
    </div>
  </div>
</template>

<script lang="ts">
import Vue from "vue";
import { Component } from "vue-property-decorator";

@Component
export default class Root extends Vue {
}
</script>
