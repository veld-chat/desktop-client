<template>
  <div
    v-if="user"
    :class="`member-list-item ${userStatusClass}`"
  >
    <avatar
      class="mr-3"
      :src="`https://cdn.miki.bot/chat/avatars/${user.avatarUrl || user.id % 5}.png`"
      :rounded="true"
    />
    <div>
      <user-title :user="user" />
      <span class="text-secondary">
        {{ userStatus }}
      </span>
    </div>
  </div>
</template>

<script lang="ts">
import Vue from "vue";
import { Prop, Component } from "vue-property-decorator";
import { StatusType, User } from "../models";
import UserTitle from "./user-title.vue";
import Avatar from "./avatar.vue";

@Component({
  components: {
    Avatar,
    UserTitle,
  },
})
export default class MemberListItem extends Vue {
  @Prop() user: User;

  get userStatusClass() {
    if (!this.user.status) {
      return "offline";
    }

    return StatusType[this.user.status.statusType].toLowerCase();
  }

  get userStatus() {
    if (!this.user.status) {
      return "Offline";
    }

    if (!this.user.status.statusText) {
      return StatusType[this.user.status.statusType];
    }
    return this.user.status.statusText;
  }
}
</script>
