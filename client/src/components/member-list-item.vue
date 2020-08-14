<template>
  <div class="member-list-item">
    <div
      v-if="user.avatarUrl"
      class="msg-instance-avatar"
      :style="{ backgroundImage: `url('${user.avatarUrl}')` }"
    />
    <div>
      <span class="flex text-centered fit-text">
        <div class="user-name fit-text">{{ user.name }}</div>
        <div v-if="user.bot" class="badge">BOT</div>
      </span>
      <div>{{ user.status.value }}</div>
    </div>
  </div>
</template>

<script lang="ts">
import Vue from "vue";
import { Prop, Component } from "vue-property-decorator";
import { User } from "@/models";

@Component
export default class MemberListItem extends Vue {
  @Prop() user: User;
}
</script>
