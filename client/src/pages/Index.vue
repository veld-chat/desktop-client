/* eslint-disable vue/no-v-html */
<template>
  <div class="main">
    <div class="sidebar flex column space-between">
      <channel-list />
      <current-user-view />
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
        <div v-if="channel" class="messages">
          <div v-for="(message, id) in channel.messages" :key="id">
            <chat-message :message="message" />
          </div>
        </div>
      </div>

      <chat-bar />
    </div>
    <member-list />
  </div>
</template>

<script lang="ts">
import Vue from "vue";
import { Component, Ref, Watch } from "vue-property-decorator";
import Login from "../components/login.vue";
import ChatBar from "../components/chat-bar.vue";
import MemberList from "../components/member-list.vue";
import { Channel, User } from "@/models";
import { store } from "@/store";
import { namespace } from "vuex-class";
import ChatMessage from "@/components/chat-message.vue";
import { connect } from "@/connection";
import ChannelList from "../components/channel-list.vue";
import CurrentUserView from "../components/current-user";

const channels = namespace("channels");

@Component({
  components: { ChatMessage, ChatBar, MemberList, ChannelList, Login, CurrentUserView },
})
export default class Root extends Vue {
  @Ref() container: HTMLDivElement;
  @channels.Getter("current") channel: Channel;

  showLogin = false;

  currentUserId = "";
  message = "";
  token = "";
  scroll: boolean;

  mounted(): void {
    connect();

    if (Notification.permission !== "granted") {
      Notification.requestPermission();
    }

    window.addEventListener("resize", this.updateScroll);
    window.addEventListener("resize", this.setMobileSize);
    this.setMobileSize();
    
    this.container.addEventListener("scroll", this.setChannelScroll);
  }

  beforeDestroy(): void {
    window.removeEventListener("resize", this.updateScroll);
    this.container.removeEventListener("scroll", this.setChannelScroll);
  }

  setChannelScroll() {
    const { container } = this;
    let scroll: number | "end" = container.scrollTop;

    if (scroll >= container.scrollHeight - container.clientHeight - 100) {
      scroll = "end";
    }

    if (this.channel.scroll !== scroll) {
      this.$store.dispatch("channels/setScroll", { id: this.channel.id, scroll });
    }
  }
  
  setMobileSize() {
    let vh = window.innerHeight * 0.01;
    document.documentElement.style.setProperty('--vh', `${vh}px`);
  }

  @Watch("channel.messages")
  updateScroll() {
    if (this.channel.scroll === "end") {
      this.$nextTick(() => {
        this.container.scroll(0, this.container.scrollHeight);
      });
    }
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
}
</script>
