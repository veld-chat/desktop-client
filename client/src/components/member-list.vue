<template>
  <div class="sidebar users">
    <div v-for="user in currentUsers" :key="user.id">
      <member-list-item :user="user" />
    </div>
  </div>
</template>

<script lang="ts">
import Vue from "vue";
import { Component } from "vue-property-decorator";
import { Channel, User } from "@/models";
import { namespace } from "vuex-class";
import MemberListItem from "./member-list-item.vue";

const channels = namespace("channels");
const users = namespace("users");

@Component({
  components: { MemberListItem },
})
export default class MemberList extends Vue {
  @users.State("users") users: User[];
  @channels.Getter("current") channel: Channel;

  get currentUsers() {
    const { channel, users } = this;

    if (!channel || channel.system) {
      return users;
    }

    return users.filter(u => channel.members.includes(u.id));
  }
}
</script>
