/* eslint-disable vue/no-v-html */
<template>
  <div class="main">
    <div class="row">
      <div class="col-xs">
        <div class="intern-container wrapper">
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
            </header>
          </div>
          <div ref="container" class="messages">
            <div v-for="(message, id) in messages" :key="id" class="msg-instance-container fadein">
              <div
                v-if="message.user.avatarUrl"
                class="msg-instance-avatar"
                :style="{ backgroundImage: message.user.avatarUrl && `url('${message.user.avatarUrl}')` }"
              />
              <div class="msg-content-wrapper">
                <div class="msg-instance-title">{{ message.user.name }}</div>
                <p
                  class="msg-instance"
                  :class="message.mentionsSelf ? 'mention' : ''"
                  v-html="message.message"
                />
              </div>
            </div>
          </div>
          <chat-bar
            :ready="connected"
            @send="sendMessage"
            @startTyping="startTyping"
            :current-user-id="this.currentUserId"
          />
        </div>
      </div>
      <div class="col-xs hide-mobile member-list" style="flex-grow: 0;">
        <div v-for="(user, id) in members" :key="id">
          <member-list-item :user="user" />
        </div>
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import Vue from "vue";
import { Component, Ref } from "vue-property-decorator";
import marked from "marked";
import io from "socket.io-client";
import DOMPurify from "dompurify";
import { MessageCreateEvent, Message, User } from "@/models/events";
import { MentionParser } from "@/utils/mention-parser";
import twemoji from "twemoji";

import userStore from "../store/user-store";
import userTypingStore from "../store/user-typing-store";

import ChatBar from "../components/chat-bar.vue";
import MemberListItem from "../components/member-list-item.vue";
import { ScrollInformation, shouldScroll } from "@/utils/scroll";

@Component({
  components: { ChatBar, MemberListItem },
})
export default class Root extends Vue {
  private connection: SocketIOClient.Socket;

  @Ref() container: HTMLDivElement;
  messages: MessageCreateEvent[] = [];
  members: User[] = [];

  mentionParser: MentionParser = new MentionParser();

  currentUserId = "";
  message = "";
  token = "";
  connected = false;
  resizeTimer?: number;
  scroll: ScrollInformation;

  mounted(): void {
    userStore.onUpdate(() => {
      this.members = userStore.list();
    });

    this.connection = io("chat-gateway.veld.dev");

    this.connection.on("sys-join", (x) => userStore.upsert(x));
    this.connection.on("sys-leave", (x) => userStore.delete(x.id));
    this.connection.on("sys-error", (x) => {
      this.messages.push({
        user: {
          id: "system",
          name: "system",
        },
        mentions: [],
        message: this.processMessage(x.message),
      });
    });
    this.connection.on("user-edit", this.onUserEdit);

    this.connection.on("connect", () => {
      this.currentUserId = this.connection.id;
      this.connection.on("ready", (options) => {
        userStore.clear();
        userTypingStore.clear();

        this.token = options.token;
        this.currentUserId = options.user.id;
        userStore.upsert(options.user);

        if (options.members) {
          for (let user of options.members) {
            userStore.upsert(user);
          }
        }

        console.log(`Logged in as ${options.user.name} (${options.user.id})`);
        this.connected = true;
      });

      this.connection.emit("login", {
        name: localStorage.getItem("name"),
        avatarUrl: localStorage.getItem("avatarUrl"),
      });
    });

    this.connection.on("usr-typ", (user) => {
      userTypingStore.upsert({
        id: user.id,
        lastTypingTime: Date.now(),
      });
    });

    this.connection.on("usr-msg", this.publishMessage.bind(this));

    if (Notification.permission !== "granted") {
      Notification.requestPermission();
    }

    window.addEventListener("resize", this.onResize);
  }

  beforeDestroy(): void {
    this.connection.close();
    window.removeEventListener("resize", this.onResize);
  }

  onResize() {
    if (!this.scroll) {
      this.scroll = this.shouldScroll();
      this.scroll.container = this.scroll.document =
        this.scroll.document || this.scroll.container;
    }

    if (!this.resizeTimer) {
      window.clearTimeout(this.resizeTimer);
    }

    this.resizeTimer = window.setTimeout(() => {
      if (this.scroll) {
        this.applyScroll(this.scroll);
        this.scroll = undefined;
      }
    }, 250);
  }

  onUserEdit(user: User): void {
    if (user.id == this.currentUserId) {
      localStorage.setItem("name", user.name);
      localStorage.setItem("avatar", user.avatarUrl);
    }
    userStore.upsert(user);
  }

  processMessage(input: string): string {
    return twemoji.parse(
      DOMPurify.sanitize(
        marked(input, {
          headerIds: false,
          breaks: true,
        }),
        {
          ALLOWED_TAGS: ["b", "i", "em", "strong", "a", "br"],
          ALLOWED_ATTR: ["href"],
        }
      )
    );
  }

  publishMessage(message: Message): void {
    const lastMessageId = this.messages.length - 1;
    const lastMessage = this.messages[lastMessageId];
    const scroll = this.shouldScroll();

    message.mentionsSelf = message.mentions?.includes(this.currentUserId);
    if (
      message.mentionsSelf &&
      !document.hasFocus() &&
      Notification.permission == "granted"
    ) {
      var notification = new Notification(
        message.user.name + " has mentioned you!",
        {
          body: message.message,
        }
      );
    }

    if (lastMessage && lastMessage.user.id === message.user.id) {
      Vue.set(this.messages, lastMessageId, {
        ...message,
        message:
          lastMessage.message + "<br />" + this.processMessage(message.message),
      });
    } else {
      this.messages.push({
        ...message,
        message: this.processMessage(message.message),
      });
    }

    this.applyScroll(scroll);
  }

  shouldScroll(): ScrollInformation {
    return {
      container: shouldScroll(this.container),
      document: shouldScroll(document.documentElement),
    };
  }

  applyScroll(scroll: ScrollInformation): void {
    if (scroll.document || scroll.container) {
      this.$nextTick(() => {
        if (scroll.container) {
          this.container.scroll(0, this.container.scrollHeight);
        }

        if (scroll.document) {
          document.documentElement.scroll(
            0,
            document.documentElement.scrollHeight
          );
        }
      });
    }
  }

  startTyping(): void {
    this.connection.emit("usr-typ");
  }

  sendMessage(message: string): void {
    this.connection.emit("usr-msg", {
      message: message,
      mentions: this.mentionParser.fromString(message),
    });
  }
}
</script>
