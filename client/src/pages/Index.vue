/* eslint-disable vue/no-v-html */
<template>
  <div class="main" :style="{ marginBottom: barHeight + 'px' }">
    <chat-bar
      :ready="connected"
      :current-user-id="this.currentUserId"
      @send="sendMessage"
      @startTyping="startTyping"
      @height="setBarHeight"
    />

    <div class="member-list">
      <div v-for="(user, id) in members" :key="id">
        <member-list-item :user="user" />
      </div>
    </div>

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
      <div v-for="(message, id) in messages" :key="id">
        <chat-message :message="message" />
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
import {
  MessageCreateEvent,
  Message,
  User,
  MessagePart,
} from "@/models/events";
import { MentionParser } from "@/utils/mention-parser";

import userStore from "../store/user-store";
import userTypingStore from "../store/user-typing-store";

import ChatBar from "../components/chat-bar.vue";
import MemberListItem from "../components/member-list-item.vue";
import ChatMessage from "../components/chat-message.vue";
import {
  Emoji,
  isEmojiOnly,
  registerEmoji,
  replaceEmojis,
} from "@/utils/emoji";
import { Embed } from "../models/events";

if (process.isClient) {
  DOMPurify.addHook("afterSanitizeAttributes", function (currentNode) {
    if (currentNode.tagName === "A") {
      currentNode.textContent = currentNode.getAttribute("href");
      currentNode.setAttribute("target", "_blank");
    }
    return currentNode;
  });
}

@Component({
  components: { ChatBar, MemberListItem, ChatMessage },
})
export default class Root extends Vue {
  private connection: SocketIOClient.Socket;

  @Ref() container: HTMLDivElement;
  messages: Message[] = [];
  members: User[] = [];
  barHeight = 0;

  mentionParser: MentionParser = new MentionParser();

  currentUserId = "";
  message = "";
  token = "";
  connected = false;
  resizeTimer?: number;
  scroll: boolean;

  mounted(): void {
    userStore.onUpdate(() => {
      this.members = userStore.list();
    });

    const host = localStorage.getItem("gateway") || "chat-gateway.veld.dev";

    fetch(`//${host}/emojis`)
      .then((r) => r.json())
      .then((r: Emoji[]) => r.forEach(registerEmoji));

    this.connection = io(host);

    this.connection.on("sys-join", (x) => userStore.upsert(x));
    this.connection.on("sys-leave", (x) => userStore.delete(x.id));
    this.connection.on("sys-error", (x) => {
      this.messages.push({
        user: {
          id: "system",
          name: "system",
        },
        mentions: [],
        parts: [this.processMessage(x.message)],
      });
    });
    this.connection.on("user-edit", this.onUserEdit);

    this.connection.on("connect", () => {
      this.currentUserId = this.connection.id;
      this.connection.on("ready", (options) => {
        userStore.clear();
        userTypingStore.clear();

        localStorage.setItem("token", options.token);
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

      this.connection.on("token", (token) => {
        localStorage.setItem("token", token);
      });

      this.connection.emit("login", {
        token: localStorage.getItem("token") || null,
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
    userStore.upsert(user);
  }

  processMessage(
    input: string,
    embed: Embed = null,
    isMention = false
  ): MessagePart {
    const content = this.processString(input);
    const cleanEmbed = this.processEmbed(embed);

    return {
      isMention,
      embed: cleanEmbed,
      content,
      isEmojiOnly: isEmojiOnly(content),
    };
  }

  processEmbed(embed: Embed): Embed {
    if (!embed) {
      return embed;
    }

    if (embed.author) {
      if (!embed.author.value) {
        embed.author = null;
      } else {
        embed.author.value = this.processString(embed.author.value);
      }
    }

    if (embed.title) {
      embed.title = this.processString(embed.title);
    }

    if (embed.description) {
      embed.description = this.processString(embed.description);
    }

    if (embed.footer) {
      embed.footer = this.processString(embed.footer);
    }

    return embed;
  }

  processString(input: string): string {
    if (!(input || "").trim()) {
      return null;
    }

    return replaceEmojis(
      DOMPurify.sanitize(
        marked(input, {
          headerIds: false,
          breaks: true,
        }),
        {
          ALLOWED_TAGS: ["b", "i", "em", "strong", "a", "br", "code", "span"],
          ALLOWED_ATTR: ["href"],
        }
      )
    );
  }

  publishMessage(event: MessageCreateEvent): void {
    const lastMessageId = this.messages.length - 1;
    const lastMessage = this.messages[lastMessageId];
    const scroll = this.shouldScroll();
    const mentionsSelf = event.mentions?.includes(this.currentUserId);

    if (
      mentionsSelf &&
      !document.hasFocus() &&
      Notification.permission == "granted"
    ) {
      new Notification(event.user.name + " has mentioned you!", {
        body: event.message,
      });
    }

    if (lastMessage && lastMessage.user.id === event.user.id) {
      Vue.set(this.messages, lastMessageId, {
        ...event,
        parts: [
          ...lastMessage.parts,
          this.processMessage(event.message, event.embed, mentionsSelf),
        ],
      });
    } else {
      this.messages.push({
        ...event,
        parts: [this.processMessage(event.message, event.embed, mentionsSelf)],
      });
    }

    this.applyScroll(scroll);
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
        document.documentElement.scroll(
          0,
          document.documentElement.scrollHeight
        );
      });
    }
  }

  setBarHeight(height: number) {
    this.barHeight = height;
    this.applyScroll(this.shouldScroll());
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
