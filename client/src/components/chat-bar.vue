<template>
  <div class="controls-wrapper">
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
        @keyup="startTyping()"
      />
      <a class="sendbutton flex-end" @click="send()">
        <i class="fas fa-paper-plane" />
      </a>
    </div>
    <typing-bar :current-user-id="currentUserId" />
  </div>
</template>

<script lang="ts">
import Vue from "vue";
import { Component } from "vue-property-decorator";
import TypingBar from "./typing-bar.vue";

@Component({
  props: ["ready", "currentUserId"],
  components: { TypingBar },
})
export default class ChatBar extends Vue {
  message = "";
  lastTimeTyping = 0;

  startTyping(): void {
    if (this.lastTimeTyping + 5000 > new Date().getTime()) {
      return;
    }

    this.lastTimeTyping = new Date().getTime();
    this.$emit("startTyping");
  }

  send(): void {
    this.$emit("send", this.message);
    this.message = "";
  }
}
</script>
