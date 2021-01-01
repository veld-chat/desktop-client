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
import { Component } from "vue-property-decorator";
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

  async mounted() {
    if (this.channel.members.length != 0) {
      return;
    }

    var members = await client().getChannelMembers(this.channel.id);
    store.dispatch("users/add", members);
    store.dispatch(
      "channels/setMembers",
      members.map((x) => ({
        id: this.channel.id,
        member: x.id,
      }))
    );
  }

  get currentUsers() {
    const { channel, users } = this;

    if (!channel || channel.system) {
      return users;
    }

    return users.filter((u) => channel.members.includes(u.id));
  }
}
</script>
