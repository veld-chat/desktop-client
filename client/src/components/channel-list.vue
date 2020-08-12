<template>
  <div>
    <strong class="category">Channels</strong>
    <div v-for="(channel, id) in channels" :key="id">
      <channel-list-item :channel="channel" />
    </div>
    <a :onclick="newChannel()" class="channel-list-item flex text-centered selected">
      <span>
        <i class="icon fas fa-plus-square"></i>
        New Channel
      </span>
    </a>
  </div>
</template>
<script lang="ts">
import Vue from "vue";
import Component from "vue-class-component";
import ChannelListItem from "./channel-list-item.vue";
import { Channel } from "../models/events";
import { Prop } from "vue-property-decorator";

@Component({
  components: {
    ChannelListItem,
  },
})
export default class ChannelList extends Vue {
  @Prop() channels: Channel[];

  newChannel() {
    console.log("lol no.");
  }
}
</script>