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
      <a 
        class="btn alt" 
        style="cursor: pointer; font-size: 12px"
        @click.prevent="showLogin = true"
      >
        Not you?
      </a>
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
const users = namespace("users");

@Component({
  components: {
    EditUserModal,
    MemberListItem,
    Login,
  },
})
export default class CurrentUserView extends Vue {
  @session.State("user") userId: string;
  @users.Getter("byId") getUser: (id: string) => User;

  get user() {
    console.log(this.getUser(this.userId));
    return this.getUser(this.userId);
  }

  showLogin = false;
  editUserModalOpen = false;
}
</script>
