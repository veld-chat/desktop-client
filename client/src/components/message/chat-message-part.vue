<template>
  <div>
    <p
      :class="['msg-instance', part.isMention && 'is-mention', part.isEmojiOnly && 'is-emoji-only']"
    >
      <template v-for="(messagePart, index) in messageParts">
        <span
          v-if="messagePart.mentionType !== undefined"
          :key="index"
          class="channel-mention"
          @click="joinChannel(messagePart.mentionId)"
        >{{ messagePart.content }}</span>

        <template v-else>
          {{ messagePart.content }}
        </template>
      </template>
    </p>

    <chatEmbed :part="part" />
  </div>
</template>

<script lang="ts">
import Vue from "vue";
import { Prop, Component } from "vue-property-decorator";
import { MessagePart, MessagePartContent } from "@/models";
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
      return [{
        content: content
      }]
    }

    return content.split(' ')
      .map((content) => {
        if (!content.match(regex)) {
          return {
            content: content
          }
        }

        // Extract channel ID
        const channelID = content.match(regex)[1];

        return {
          content: `#${this.getChannelName(channelID)}`,
          mentionType: "channel",
          mentionId: channelID
        }
      })
  }

  getChannelName(id: string): string {
    // Not possible yet cuz Veld lazy
    return 'channel-name'
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
