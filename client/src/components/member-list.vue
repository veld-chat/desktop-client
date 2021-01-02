<template>
  <div class="sidebar users">
    <div 
      v-for="user in currentUsers" 
      :key="user.id"
    >
      <member-list-item :user="user" />
    </div>
  </div>
</template>

<script lang="ts">
import Vue from "vue";
import { Component, Watch } from "vue-property-decorator";
import { Channel, User } from "../models";
import { namespace } from "vuex-class";
import MemberListItem from "./member-list-item.vue";
import { client } from "../api-client";
import { store } from "../store";

const channels = namespace("channels");
const users = namespace("users");

@Component({
  components: { MemberListItem },
})
export default class MemberList extends Vue {
  @users.State("users") users: User[];
  @channels.Getter("current") channel: Channel;
  @channels.Getter("currentId") channelId: string;

  get currentUsers() {
    const { channel, users } = this;
    if (!channel || channel.system) {
      return users;
    }

    if (!channel.members) {
      return users;
    }

    return users;
  }

  @Watch("channelId")
  async fetchChannelsOnSelectChannel() {
    if (!this.channel) {
      return;
    }

    var members = await client().getChannelMembers(this.channel.id);
    await store.dispatch("users/add", members);

    for (let member of members) {
      await store.dispatch("channels/addMember", {
        id: this.channel.id,
        member: member.id,
      });
    }
  }
}
</script>
