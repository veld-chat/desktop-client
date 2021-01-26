<template>
  <div class="sidebar users">
    <div 
      v-if="currentUsers"
    >
      <member-list-item 
        v-for="user in currentUsers" 
        :key="user.id"
        :user="user" 
      />
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
import * as sorts from "../utils/sorts";

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
    return [...this.users].sort(sorts.sortUserByStatusThenName);
  }

  @Watch("channelId")
  async fetchChannelsOnSelectChannel() {
    if (!this.channel) {
      return;
    }

    var members = await client().getChannelMembers(this.channel.id);
    await store.dispatch("users/add", members);
  }
}
</script>
