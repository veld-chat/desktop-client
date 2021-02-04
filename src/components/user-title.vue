<template>
  <div
    v-if="user"
    class="flex fit-text"
  >
    <span class="user-name fit-text">
      {{ user.name }}
    </span>
    <img
      v-if="hasBadge('Bot')"
      class="ml-1 icon"
      src="/assets/bot.svg"
    >
    <img
      v-if="hasBadge('Admin')"
      class="ml-1 icon"
      src="/assets/admin.svg"
    >
    <img
      v-if="hasBadge('Supporter')"
      class="ml-1 icon"
      src="/assets/supporter.svg"
    >
    <slot />
  </div>
</template>

<script lang="ts">
import Vue from "vue";
import { Prop, Component } from "vue-property-decorator";
import { User, UserBadges } from "../models";

@Component
export default class UserTitle extends Vue {
  @Prop() user: User;

  hasBadge(e: string) {
    return this.user.badges & UserBadges[e];
  }
}
</script>
