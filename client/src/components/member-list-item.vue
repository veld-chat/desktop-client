<template>
  <div 
    v-if="user"
    class="member-list-item" 
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
      <div>Online</div>
    </div>
  </div>
</template>

<script lang="ts">
import Vue from "vue";
import { Prop, Component } from "vue-property-decorator";
import { User } from "../models";

@Component
export default class MemberListItem extends Vue {
  @Prop() user: User;
}
</script>
