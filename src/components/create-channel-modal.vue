<template>
  <div>
    <modal
      :open="open"
      @close="closeModal"
    >
      <h2> Create a new Channel </h2>
      <p>Name</p>
      <input
        v-model="channelName"
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
          @click.prevent="createChannel"
        >Create Channel</a>
        <a class="button outline secondary">Back</a>
      </div>
    </modal>
  </div>
</template>
<script lang="ts">
import Vue from "vue";
import Modal from "./modal.vue";
import { Prop, Component } from "vue-property-decorator";
import { namespace } from "vuex-class";

const session = namespace("session");

@Component({
  components: { Modal },
})
export default class CreateChannelModal extends Vue {
  channelName = "";
  error = null;
  @Prop() open: boolean;
  @session.State("token") token: string;

  async createChannel() {
    if (!this.channelName || this.channelName.length == 0) {
      this.error = "Cannot create a channel without name.";
      return;
    }

    let json = JSON.stringify({
      name: this.channelName,
    });

    const host = localStorage.getItem("gateway") || "chat-gateway.veld.dev";
    await fetch(`https://${host}/channels`, {
      method: "POST",
      body: json,
      headers: {
        Authorization: "Bearer " + this.token,
        "Content-Type": "application/json",
      },
    }).catch((x) => (this.error = x.message));
    this.closeModal();
  }

  closeModal() {
    this.$emit("close");
  }
}
</script>
