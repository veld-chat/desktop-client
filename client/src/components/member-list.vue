<template>
  <div class="sidebar">
    <div v-for="user in users" :key="user.id">
      <member-list-item :user="user" />
    </div>
  </div>
</template>

<script lang="ts">
import Vue from "vue";
import { Component } from "vue-property-decorator";
import { User } from "@/models";
import { namespace } from "vuex-class";
import MemberListItem from "./member-list-item.vue";

const users = namespace("users");

@Component({
  components: { MemberListItem },
})
export default class MemberList extends Vue {
  @users.State("users") users: User[];
}
</script>
