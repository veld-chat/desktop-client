<template>
  <div class="row main">
    <div class="wrapper">
      <div class="intern-container">
        <div class="heading-wrapper">
          <header class="heading">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              style="height: 2rem;"
              viewBox="0 0 674.731 463.131"
            >
              <path
                d="M8433.373,1216.334l236.061-406.322,161.628,286.636,67.489,119.687H9051.3l-205.974-362.35-68.206,120.93"
                transform="translate(-8400.564 -786.011)"
                fill="none"
                stroke="#fff"
                stroke-linecap="round"
                stroke-linejoin="round"
                stroke-width="48"
              ></path>
            </svg>
          </header>
        </div>
        <div ref="container" class="messages">
          <div
            v-for="(message, id) in messages"
            :key="id"
            class="msg-instance-container fadein">
            <div v-if="message.user.avatarUrl"
              class="msg-instance-avatar"
              :style="{ backgroundImage: `url('${message.user.avatarUrl}')` }"
            ></div>
            <div class="msg-content-wrapper">
              <div class="msg-instance-title">{{ message.user.name }}</div>
              <p class="msg-instance" v-html="message.message" />
            </div>
          </div>
        </div>
      </div>
      <div class="controls">
        <input
          id="ui-input-field"
          v-model="message"
          type="text"
          placeholder="type your message here!"
          class="textfield"
          maxlength="256"
          @keydown.enter.prevent="sendMessage()"
        />
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import Vue from "vue";
import { Component, Ref } from "vue-property-decorator";
import * as io from "socket.io-client";

@Component
export default class Root extends Vue {
  private connection: SocketIOClient.Socket;

  @Ref() container: HTMLDivElement;
  messages: Message[] = [];
  users: any[] = [];

  message = "";

  mounted() {
    this.connection = io(":1234");
    this.connection.on("usr-msg", this.publishMessage.bind(this));
    this.connection.on("user-edit", this.onUserEdit.bind(this));
    this.connection.on("sys-join", this.onUserAdd.bind(this));
    this.connection.on("sys-leave", this.onUserLeave.bind(this));
  }

  beforeDestroy() {
    this.connection.close();
  }

  onUserAdd(user: any) {
    console.log("user " + user.id + " joined");
    this.users[user.id] = user;
  }

  onUserEdit(user: any) {
    console.log("user " + user.id + " mutated");

    this.publishMessage({
      message: `user '${this.users[user.id].name}'' is now '${user.name}'.`,
      user: {
        id: "system",
        name: "system",
      },
    });

    this.users[user.id] = user;
  }

  onUserLeave(user:any) {
    delete this.users[user.id];
  }

  sendMessage() {
    this.connection.emit("usr-msg", this.message);
    this.message = "";
  }

  publishMessage(message: Message) {
  const lastMessageId = this.messages.length - 1;
    const lastMessage = this.messages[lastMessageId];
    const container = this.container;
    const scroll =
      container.scrollTop >= container.scrollHeight - container.offsetHeight;

    if (lastMessage && lastMessage.user.id === message.user.id) {
      Vue.set(this.messages, lastMessageId, {
        ...message,
        message: lastMessage.message + "<br/>" + message.message,
      });
    } else {
      this.messages.push(message);
    }

    if (scroll) {
      this.$nextTick(() => {
        window.scroll(0, document.body.scrollHeight);
      });
    }
  }
}
</script>
