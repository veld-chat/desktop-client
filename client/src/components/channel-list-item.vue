<template>
  <a :onclick="setChannel()" :class="`channel-list-item ${selected ? 'selected' : ''}`">
    <span class="flex text-centered">
      <i class="icon fas fa-hashtag"></i>
      {{ channel.name }}
    </span>
    <div class="flex">
      <div
        v-if="channel.mentions && channel.mentions > 0"
        class="badge is-danger"
      >{{channel.mentions}}</div>
      <div
        class="badge is-secondary"
      >{{channel.members.some(x => x.status.value === "online")}}/{{channel.members.length}}</div>
    </div>
  </a>
</template>
<script lang="ts">
import Vue from "vue";
import Component from "vue-class-component";
import { Prop } from "vue-property-decorator";
import { Channel } from "../models/events";

@Component
export default class ChannelListItem extends Vue {
  @Prop() channel: Channel;
  @Prop() selected: boolean;

  setChannel(): void {
    console.log("lol not implemented");
  }
}
</script>