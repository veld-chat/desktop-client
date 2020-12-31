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
        >
        <i class="fas fa-hashtag"/>
        {{ messagePart.content }}
        </span>
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
import { Channel, MessagePart, MessagePartContent } from "../../models";
import { namespace } from "vuex-class";
import { store } from "../../store";

import chatEmbed from "./chat-embed-part.vue";

const session = namespace("session");
const channels = namespace("channels");

@Component({
  components: { chatEmbed },
})
export default class ChatMessagePart extends Vue {
  @session.State("token") token: string;
  @channels.State("channels") channels: Channel[];
  @Prop() part: MessagePart;

  messageParts = [];

  mounted() {
    this.messageParts = this.channelMention(this.part.content as string);
  }

  channelMention(content: string): MessagePartContent[] {
    const regex = new RegExp("{#([0-9]*)}");

    if (!content.match(regex)) {
      return [{ content }];
    }

    let parts: MessagePartContent[] = [];
    let capture: RegExpExecArray;
    while ((capture = regex.exec(content))) {
      if (capture.index > 0) {
        parts.push({
          content: content.substring(0, capture.index),
        });
      }
      console.log(capture[0]);
      console.log(capture.index);
      parts.push({
        content: this.getChannelName(capture[1]),
        mentionType: "channel",
        mentionId: capture[1],
      });
      content = content.substring(capture.index + capture[0].length);
    }

    if (content.length != 0) {
      parts.push({
        content,
      });
    }

    console.log(JSON.stringify(parts));
    return parts;
  }

  getChannelName(id: string): string {
    return this.channels.find((x) => x.id == id)?.name || "unknown channel";
  }

  async joinChannel(id: string) {
    const host = localStorage.getItem("gateway") || "chat-gateway.veld.dev";

    const res = await fetch(`https://${host}/channels/${id}/join`, {
      method: "POST",
      headers: {
        Authorization: "Bearer " + this.token,
        "Content-Type": "application/json",
      },
    });
    if (res.ok) {
      store.dispatch("channels/update", await res.json());
    }
  }
}
</script>
