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
          <b v-if="message.user.bot" class="badge">BOT</b>
        </span>
      </div>
      <div v-for="(part, id) in message.parts" :key="id">
        <p
          :class="['msg-instance', part.isMention && 'is-mention', part.isEmojiOnly && 'is-emoji-only']"
          v-html="part.content"
        />
        <div v-if="part.embed" class="embed">
          <div class="embed-top">
            <div class="embed-info">
              <a v-if="part.embed.author" class="embed-author">
                <img
                  v-if="part.embed.author.iconUrl"
                  class="embed-author-image"
                  :src="part.embed.author.iconUrl"
                />
                <span v-if="part.embed.author.value">{{ part.embed.author.value }}</span>
              </a>
              <span v-if="part.embed.title" class="embed-title">{{part.embed.title}}</span>
              <p v-if="part.embed.description">{{ part.embed.description }}</p>
              <p v-if="part.embed.footer" class="embed-footer">{{part.embed.footer}}</p>
            </div>
            <div class="embed-icon-container">
              <img v-if="part.embed.imageUrl" class="embed-icon" :src="part.embed.imageUrl" />
            </div>
          </div>
          <div>
            <img v-if="part.embed.thumbnailUrl" class="embed-image" :src="part.embed.thumbnailUrl" />
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import Vue from "vue";
import { Prop, Component } from "vue-property-decorator";
import { Message } from "../models/events";

@Component
export default class ChatMessage extends Vue {
  @Prop() message: Message;
}
</script>