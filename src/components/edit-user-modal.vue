<template>
  <div>
    <modal
      :open="open"
      @close="closeModal"
    >
      <h2>Change yourself</h2>
      <p>Name</p>
      <input
        v-model="username"
        class="input"
        type="text"
      >
      <p
        v-if="error"
        class="input-error error-label"
      >
        <i class="fas fa-exclamation-circle" />
        {{ error }}
      </p>

      <div class="flex is-right">
        <a
          class="button primary"
          @click.prevent="commit"
        >Change Username</a>
        <a 
          class="button outline secondary"
          @click.prevent="closeModal"
        >
          Cancel
        </a>
      </div>
    </modal>
  </div>
</template>
<script lang="ts">
import Vue from "vue";
import Modal from "./modal.vue";
import { Prop, Component } from "vue-property-decorator";
import { namespace } from "vuex-class";
import { client } from "../api-client";

const session = namespace("session");

@Component({
  components: { Modal },
})
export default class EditUserModal extends Vue {
  username = "";
  error = null;
  @Prop() open: boolean;
  @session.State("token") token: string;

  async commit() {
    if (!this.username || this.username.length == 0) {
      this.error = "Cannot create a channel without name.";
      return;
    }

    await client().editUser(this.username);
    this.closeModal();
  }

  closeModal() {
    this.$emit("close");
  }
}
</script>
