<template>
  <div>
    <p
      :class="['msg-instance', part.isMention && 'is-mention', part.isEmojiOnly && 'is-emoji-only']"
    >
      <template v-for="(messagePart, index) in messageParts">
        <span
          v-if="messagePart.mentionType !== undefined"
          :key="index"
          class="mention"
          @click="joinChannel(messagePart.mentionId)"
        >{{ messagePart.content }}</span>
        <span v-else v-html="messagePart.content">
        </span>
      </template>
    </p>

    <chatEmbed :part="part" />
  </div>
</template>

<script lang="ts">
import Vue from "vue";
import { Prop, Component } from "vue-property-decorator";
import { MessagePart, MessagePartContent } from "../../models";
import { namespace } from "vuex-class";

import chatEmbed from './chat-embed-part.vue'  

const session = namespace("session");

@Component({
  components: { chatEmbed },
})
export default class ChatMessagePart extends Vue {
  @session.State("token") token: string;
  @Prop() part: MessagePart;

  messageParts = []

  mounted() {
    this.messageParts = this.channelMention(this.part.content as string)

    console.log(this.messageParts)
  }

  channelMention(content: string): MessagePartContent[] {
    const regex = new RegExp('{#([0-9]*)}')

    if (!content.match(regex)) {
      return [
        { content },
      ]
    }

    let parts: MessagePartContent[] = [];
    let capture: RegExpExecArray;
    while(capture = regex.exec(content)) { 
      if(capture.index > 0) {
        parts.push({
          content: content.substring(0, capture.index),
        });
      }
      console.log(capture[0])
      console.log(capture.index);
      parts.push({
        content: this.getChannelName(capture[1]),
        mentionType: "channel",
        mentionId: capture[1],
      });
      content = content.substring(capture.index + capture[0].length); 
    }

    if(content.length != 0) {
      parts.push({
        content
      })
    }

    console.log(JSON.stringify(parts));
    return parts;
  }

  getChannelName(id: string): string {
    return id
  }

  async joinChannel(id: string) {
    const host = localStorage.getItem("gateway") || "chat-gateway.veld.dev";

    await fetch(`https://${host}/api/v1/channels/${id}/join`, {
      method: "POST",
      headers: {
        Authorization: "Bearer " + this.token,
        "Content-Type": "application/json",
      },
    }).catch((x) => console.log(x));
  }
}
</script>
