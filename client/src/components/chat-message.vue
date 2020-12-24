<template>
  <div class="msg-instance-container fadein">
    <div
      v-if="message.user.avatarUrl"
      class="msg-instance-avatar"
      :style="{ backgroundImage: message.user.avatarUrl && `url('${message.user.avatarUrl}')` }"
    />
    <div class="msg-content-wrapper">
      <div class="msg-instance-title">
        <span class="flex text-centered">
          {{ message.user.name }}
          <b
            v-if="message.user.bot"
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
import MessagePart from "./message/chat-message-part.vue"
import { Prop, Component } from "vue-property-decorator";
import { Message } from "@/models";

@Component({
  components: { MessagePart },
})
export default class ChatMessage extends Vue {
  @Prop() message: Message;
}
</script>
