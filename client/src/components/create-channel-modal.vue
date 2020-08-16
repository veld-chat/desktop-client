<template>
  <div>
    <modal :open="open" @close="closeModal">
      <input class="input" type="text" v-model="channelName" />
      <div class="flex">
        <a class="button primary" @click.prevent="createChannel">Create Channel</a>
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
  @Prop() open: boolean;
  @session.State("token") token: string;

  async createChannel() {
    let json = JSON.stringify({
      name: this.channelName,
    });

    const host = localStorage.getItem("gateway") || "chat-gateway.veld.dev";
    await fetch(`https://${host}/api/v1/channels`, {
      method: "POST",
      body: json,
      headers: {
        Authorization: "Bearer " + this.token,
        "Content-Type": "application/json",
      },
    }).catch((x) => console.log(x));
    this.closeModal();
  }

  closeModal() {
    this.$emit("close");
  }
}
</script>