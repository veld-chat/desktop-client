<template>
  <div>
    <!-- lol a dummy file -->
  </div>
</template>

<script lang="ts">
import Vue from "vue";
import { Component } from "vue-property-decorator";
import { namespace } from "vuex-class";

const channels = namespace("channels");

@Component({
  metaInfo() {
    return {
      title: this.currentName ? '#' + this.currentName : 'Loading...'
    }
  }
})
export default class Root extends Vue {
  @channels.State("currentName") currentName: string;
}
</script>
