<template>
  <div 
    v-if="user" 
    class="flex text-centered fit-text"
  >
    <div class="user-name fit-text">
      {{ user.name }}
    </div>
    <img
      v-if="hasBadge('Bot')"
      class="emoji"
      src="/assets/bot.svg" 
    >
    <img 
      v-if="hasBadge('Admin')"
      class="emoji"
      src="/assets/admin.svg" 
    >
    <img 
      v-if="hasBadge('Supporter')"
      class="emoji"
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
