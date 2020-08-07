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
            class="msg-instance-container fadein"
          >
            <div
              class="msg-instance-avatar"
              :style="{ backgroundImage: `url('${message.avatarurl}')` }"
            ></div>
            <div class="msg-content-wrapper">
              <div class="msg-instance-title">{{ message.name }}</div>
              <p class="msg-instance" v-html="message.message"></p>
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
  message = "";

  mounted() {
    this.connection = io();
    this.connection.on("usr-msg", this.onMessage.bind(this));
  }

  beforeDestroy() {
    this.connection.close();
  }

  onMessage(message: Message) {
    const lastMessageId = this.messages.length - 1;
    const lastMessage = this.messages[lastMessageId];
    const container = this.container;
    const scroll =
      container.scrollTop >= container.scrollHeight - container.offsetHeight;

    if (lastMessage && lastMessage.userid === message.userid) {
      Vue.set(this.messages, lastMessageId, {
        ...message,
        message: lastMessage.message + "<br />" + message.message,
      });
    } else {
      this.messages.push(message);
    }

    if (scroll) {
      this.$nextTick(() => {
        container.scrollTop = container.scrollHeight;
      });
    }
  }

  sendMessage() {
    this.connection.emit("usr-msg", this.message);
    this.message = "";
  }
}
</script>
