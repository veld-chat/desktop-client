<template>
  <div class="msg-instance-container fadein">
    <div
      class="msg-instance-avatar"
      :style="{ backgroundImage: `url('https://cdn.miki.bot/chat/avatars/${message.author.avatarUrl || message.author.id % 5}.png')` }"
    />
    <div class="msg-content-wrapper">
      <div class="msg-instance-title">
        <span class="flex text-centered">
          {{ message.author.name }}
          <b
            v-if="message.author.isBot"
            class="badge"
          >BOT</b>
        </span>
      </div>
      <MessagePart
        v-for="part in message.parts"
        :key="part.id"
        :part="part"
      />
    </div>
  </div>
</template>

<script lang="ts">
import Vue from "vue";
import MessagePart from "./message/chat-message-part.vue";
import { Prop, Component } from "vue-property-decorator";
import { Message } from "../models";

@Component({
  components: { MessagePart },
})
export default class ChatMessage extends Vue {
  @Prop() message: Message;
}
</script>
