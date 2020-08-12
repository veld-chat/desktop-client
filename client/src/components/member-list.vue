<template>
  <div class="member-list">
    <div
      v-for="(user, id) in users"
      :key="id"
    >
      <div class="member-list-item">
        <div
          v-if="user.avatarUrl"
          class="msg-instance-avatar"
          :style="{ backgroundImage: `url('${user.avatarUrl}')` }"
        />
        <div>
          <div class="user-name">
            {{ user.name }}
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import Vue from "vue";
import { Component } from "vue-property-decorator";
import { User } from "@/models";
import { namespace } from "vuex-class";

const users = namespace("users");

@Component
export default class MemberListItem extends Vue {
  @users.State("users") users: User[]
}
</script>
