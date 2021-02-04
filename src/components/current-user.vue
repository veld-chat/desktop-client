<template>
  <div>
    <div class="flex space-between align-center">
      <current-user-view />
      <g-link
        to="/settings"
        class="btn square"
      >
        <i class="fas fa-cog" />
      </g-link>
    </div>
  </div>
</template>
<script lang="ts">
import Vue from "vue";
import Component from "vue-class-component";
import EditUserModal from "./edit-user-modal.vue";
import MemberListItem from "./member-list-item.vue";
import CurrentUserView from "./current-user-view.vue";
import Login from "./login.vue";
import { namespace } from "vuex-class";
import { User } from "../models";

const session = namespace("session");

@Component({
  components: {
    EditUserModal,
    MemberListItem,
    Login,
    CurrentUserView,
  },
})
export default class CurrentUser extends Vue {
  @session.Getter("user") user: User;

  showLogin = false;
  editUserModalOpen = false;
}
</script>
