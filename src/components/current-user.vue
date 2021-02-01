<template>
  <div>
    <edit-user-modal
      :open="editUserModalOpen"
      @close="editUserModalOpen = false"
    />
    <login
      v-if="showLogin"
      @close="showLogin = false"
    />
    <div class="flex space-between align-bottom">
      <a
        class="hoverable"
        @click.prevent="editUserModalOpen = true"
      >
        <member-list-item
          :user="user"
        />
      </a>
      <g-link to="/settings" class="btn alt">
        Settings
      </g-link>
    </div>
  </div>
</template>
<script lang="ts">
import Vue from "vue";
import Component from "vue-class-component";
import EditUserModal from "./edit-user-modal.vue";
import MemberListItem from "./member-list-item.vue";
import Login from "./login.vue";
import { namespace } from "vuex-class";
import { User } from "../models";

const session = namespace("session");

@Component({
  components: {
    EditUserModal,
    MemberListItem,
    Login,
  },
})
export default class CurrentUserView extends Vue {
  @session.Getter("user") user: User;

  showLogin = false;
  editUserModalOpen = false;
}
</script>
