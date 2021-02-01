<template>
  <transition name="fade">
    <div
      v-show="$route.name !== 'home'"
      class="overlay"
    >
      <router-view />
    </div>
  </transition>
</template>


<script lang="ts">
import Vue from "vue";
import { Component } from "vue-property-decorator";

@Component
export default class Root extends Vue {

}
</script>
