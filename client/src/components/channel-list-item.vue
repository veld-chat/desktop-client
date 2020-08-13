<template>
  <a
    :class="`channel-list-item ${currentChannel == channel.id ? 'selected' : ''}`"
    @click="setChannel"
  >
    <span class="flex text-centered">
      <i class="icon fas fa-hashtag"></i>
      {{ channel.name }}
    </span>
    <div class="flex">
      <div
        v-if="channel.mentions && channel.mentions > 0"
        class="badge is-danger"
      >{{channel.mentions}}</div>
      <div v-if="channel.members" class="badge is-secondary">{{onlineMembers}}/{{totalMembers}}</div>
    </div>
  </a>
</template>
<script lang="ts">
import Vue from "vue";
import Component from "vue-class-component";
import { Prop } from "vue-property-decorator";
import { Channel, User } from "@/models";
import { namespace } from "vuex-class";

let users = namespace("users");
let channels = namespace("channels");

@Component
export default class ChannelListItem extends Vue {
  @users.State("usersById") users: { [id: string]: User };
  @channels.State("currentChannel") currentChannel: string;
  @channels.Action("setCurrentChannel") setCurrentChannel;

  @Prop() channel: Channel;
  @Prop() selected: boolean;

  setChannel(): void {
    if (this.currentChannel == this.channel.id) {
      return;
    }
    this.setCurrentChannel(this.channel.id);
  }

  get onlineMembers(): number {
    return this.channel.members
      .map((x) => this.users[x] || null)
      .filter((x) => x)
      .filter((x) => x.status.value === "online").length;
  }

  get totalMembers(): number {
    return this.channel.members.length;
  }
}
</script>