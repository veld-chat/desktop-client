<template>
  <div 
    v-if="user"
    :class="`member-list-item ${userStatusClass}`" 
  >
    <div
      class="msg-instance-avatar"
      :style="{ backgroundImage: `url('https://cdn.miki.bot/chat/avatars/${user.avatarUrl || user.id % 5}.png')` }"
    />
    <div>
      <span class="flex text-centered fit-text">
        <div class="user-name fit-text">{{ user.name }}</div>
        <div 
          v-if="user.isBot"
          class="badge"
        >
          Bot
        </div>
      </span>
      <div>{{ userStatus }}</div>
    </div>
  </div>
</template>

<script lang="ts">
import Vue from "vue";
import { Prop, Component } from "vue-property-decorator";
import { StatusType, User } from "../models";

@Component
export default class MemberListItem extends Vue {
  @Prop() user: User;

  get userStatusClass() {
    if (!this.user.status) {
      return "offline";
    }

    return StatusType[this.user.status.statusType].toLowerCase();
  }

  get userStatus() {
    console.log(this.user);
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
