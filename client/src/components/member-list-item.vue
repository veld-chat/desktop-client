<template>
  <div class="member-list-item">
    <div
      v-if="user.avatarUrl"
      class="msg-instance-avatar"
      :style="{ backgroundImage: `url('${user.avatarUrl}')` }"
    />
    <span class="flex text-centered">
      <div class="user-name">{{ user.name }}</div>
      <div class="badge" v-if="user.bot">BOT</div>
    </span>
  </div>
</template>

<script lang="ts">
import Vue from "vue";
import { Prop, Component } from "vue-property-decorator";
import { User } from "../models/events";

@Component
export default class MemberListItem extends Vue {
  @Prop() user: User;
}
</script>