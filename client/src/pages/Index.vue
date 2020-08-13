/* eslint-disable vue/no-v-html */
<template>
  <div class="main">
    <div class="sidebar">
      <channel-list />
    </div>

    <div class="chat-section">
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
            />
          </svg>
          <login v-if="showLogin" @close="showLogin = false" />
          <div class="btn btn-sm" @click.prevent="showLogin = true">
            <i class="fa fa-user" />
            Login
          </div>
        </header>
      </div>
      <div class="message-container" ref="container">
        <div class="messages">
          <div v-for="(message, id) in messages[currentChannelId]" :key="id">
            <chat-message :message="message" />
          </div>
        </div>
      </div>

      <chat-bar :ready="connected" />
    </div>
    <member-list />
  </div>
</template>

<script lang="ts">
import Vue from "vue";
import { Component, Ref } from "vue-property-decorator";
import Login from "../components/login.vue";
import ChatBar from "../components/chat-bar.vue";
import MemberList from "../components/member-list.vue";
import { Message, User } from "@/models";
import { store } from "@/store";
import { namespace } from "vuex-class";
import ChatMessage from "@/components/chat-message.vue";
import { connect } from "@/connection";
import ChannelList from "../components/channel-list.vue";

const messages = namespace("messages");
const channels = namespace("channels");

@Component({
  components: { ChatMessage, ChatBar, MemberList, ChannelList, Login },
})
export default class Root extends Vue {
  @Ref() container: HTMLDivElement;
  @messages.State("messages") messages: { [channelId: string]: Message[] };
  @channels.State("currentChannel") currentChannelId: number;

  barHeight = 0;
  showLogin = false;

  currentUserId = "";
  message = "";
  token = "";
  connected = false;
  resizeTimer?: number;
  scroll: boolean;

  mounted(): void {
    connect();

    if (Notification.permission !== "granted") {
      Notification.requestPermission();
    }

    window.addEventListener("resize", this.onResize);
  }

  beforeDestroy(): void {
    window.removeEventListener("resize", this.onResize);
  }

  onResize() {
    if (!this.scroll) {
      this.scroll = this.shouldScroll();
    }

    if (!this.resizeTimer) {
      window.clearTimeout(this.resizeTimer);
    }

    this.resizeTimer = window.setTimeout(() => {
      if (this.scroll) {
        this.applyScroll(this.scroll);
        this.scroll = undefined;
      }
    }, 200);
  }

  onUserEdit(user: User): void {
    if (user.id == this.currentUserId) {
      localStorage.setItem("name", user.name);
      localStorage.setItem("avatar", user.avatarUrl);
    }
    store.dispatch("users/update", user);
  }

  shouldScroll(): boolean {
    const element = document.documentElement;

    return (
      element.scrollTop >= element.scrollHeight - element.clientHeight - 100
    );
  }

  applyScroll(scroll: boolean): void {
    if (scroll) {
      this.$nextTick(() => {
        this.container.scroll(0, this.container.scrollHeight);
      });
    }
  }

  setBarHeight(height: number) {
    this.barHeight = height;
    this.applyScroll(this.shouldScroll());
  }
}
</script>
