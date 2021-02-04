<template>
  <div>
    <strong class="category">Channels</strong>
    <div v-if="channels">
      <div
        v-for="(channel, id) in channels"
        :key="id"
      >
        <channel-list-item :channel="channel" />
      </div>
    </div>
    <div v-else>
      <p>No channels yet!</p>
    </div>

    <create-channel-modal
      :open="modalOpen"
      @close="closeModal"
    />
    <a
      class="channel-list-item flex align-center selected"
      @click="openModal"
    >
      <span>
        <i class="icon fas fa-plus" />
        Create channel
      </span>
    </a>
  </div>
</template>
<script lang="ts">
import Vue from "vue";
import Component from "vue-class-component";
import ChannelListItem from "./channel-list-item.vue";
import CreateChannelModal from "./create-channel-modal.vue";
import { Channel } from "../models";
import { namespace } from "vuex-class";

const channels = namespace("channels");

@Component({
  components: {
    ChannelListItem,
    CreateChannelModal,
  },
})
export default class ChannelList extends Vue {
  @channels.State("channels") channels: Channel[];

  modalOpen = false;

  openModal() {
    this.modalOpen = true;
  }

  closeModal() {
    this.modalOpen = false;
  }
}
</script>
