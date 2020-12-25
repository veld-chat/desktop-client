<template>
  <div
    v-if="part.embed"
    class="embed"
  >
    <div class="embed-top" 
      v-if="part.embed.author 
        || part.embed.title 
        || part.embed.description 
        || part.embed.imageUrl">
      <div class="embed-info">
        <a
          v-if="part.embed.author"
          class="embed-author"
        >
          <img
            v-if="part.embed.author.iconUrl"
            class="embed-author-image"
            :src="part.embed.author.iconUrl"
          >
          <span v-if="part.embed.author.value" v-html="part.embed.author.value"></span>
        </a>
        <span
          v-if="part.embed.title"
          v-html="part.embed.title"
          class="embed-title"
        ></span>
        <p v-if="part.embed.description" v-html="part.embed.description "></p>
        <p v-if="part.embed.footer"
          v-html="part.embed.footer"
          class="embed-footer"
        ></p>
      </div>
      <div
        v-if="part.embed.imageUrl"
        class="embed-icon-container"
      >
        <img
          :src="part.embed.imageUrl"
          class="embed-icon"
        />
      </div>
    </div>
    <div>
      <img
        v-if="part.embed.thumbnailUrl"
        class="embed-image"
        :src="part.embed.thumbnailUrl"
      >
    </div>
  </div>
</template>
<script lang="ts">
import Vue from "vue";
import { Prop, Component } from "vue-property-decorator";
import { MessagePart } from "@/models";

@Component
export default class ChatMessagePart extends Vue {
  @Prop() part: MessagePart;
}
</script>
