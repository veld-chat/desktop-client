<template>
  <div class="msg-instance-container fadein">
    <div
      class="msg-instance-avatar"
      :style="{ backgroundImage: `url('https://cdn.miki.bot/chat/avatars/${message.author.avatarUrl || message.author.id % 5}.png')` }"
    />
    <div class="msg-content-wrapper">
      <user-title :user="message.author">
        <span class="ml-3 subtitle">{{ timestamp(message.timestamp) }}</span>
      </user-title>
      <message-part
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
import UserTitle from "./user-title.vue";

import { Prop, Component } from "vue-property-decorator";
import { Message } from "../models";
import moment from "moment";

@Component({
  components: {
    MessagePart,
    UserTitle,
  },
})
export default class ChatMessage extends Vue {
  @Prop() message: Message;

  timestamp(time: Date) {
    return moment(time).calendar();
  }
}
</script>
