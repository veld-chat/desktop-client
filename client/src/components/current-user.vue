<template>
  <div>
    <login v-if="showLogin" @close="showLogin = false" />
    <div class="flex space-between align-bottom">
      <member-list-item :user="user"/>
      <a class="btn alt" style="cursor: pointer; font-size: 12px" @click.prevent="showLogin = true">
        Not you?
      </a>
    </div>
  </div>
</template>
<script lang="ts">
import Vue from "vue";
import Component from "vue-class-component";
import MemberListItem from "./member-list-item.vue";
import Login from "./login.vue";
import { namespace } from "vuex-class";
import { User } from "../models";

const session = namespace("session");

@Component({
  components: {
    MemberListItem,
    Login,
  },
})
export default class CurrentUserView extends Vue {
  @session.State("user") user: User;
  showLogin = false;
}
</script>
