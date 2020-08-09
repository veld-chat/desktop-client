<template>
  <div class="member-list-item">
    <div
      v-if="user.avatarUrl"
      class="msg-instance-avatar"
      :style="{ backgroundImage: `url('${user.avatarUrl}')` }"
    />
    <div>
      <div class="user-name">{{ user.name }}</div>
    </div>
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