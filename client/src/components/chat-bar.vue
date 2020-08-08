<template>
  <div class="controls">
    <input
      id="ui-input-field"
      v-model="message"
      type="text"
      :placeholder="ready ? `type your message here!` : `connecting...`"
      class="textfield"
      maxlength="256"
      :disabled="!ready"
      @keydown.enter.prevent="send()"
    />
    <a class="sendbutton flex-end" v-on:click="send()">
      <i class="fas fa-paper-plane"></i>
    </a>
  </div>
</template>

<script lang="ts">
import Vue from "vue";
import { Component } from "vue-property-decorator";

@Component({
  props: ["ready"],
})
export default class ChatBar extends Vue {
  message = "";

  send(): void {
    this.$emit("send", this.message);
    this.message = "";
  }
}
</script>
