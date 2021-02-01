<template>
  <div class="typing-bar">
    <span
      :style="`display: flex; align-items: baseline;` + (currentlyTyping.length > 0 ? '' : 'visibility: hidden;')"
    >
      <i class="icon fas fa-ellipsis-h" />
      {{ `${userTypingText} ${typing.length === 1 ? "is" : "are"} typing...` }}
    </span>
  </div>
</template>

<script lang="ts">
import Vue from "vue";
import Component from "vue-class-component";
import { namespace } from "vuex-class";
import { User, UserTyping } from "../models";

const users = namespace("users");
const session = namespace("session");

@Component({})
export default class TypingBar extends Vue {
  private timerId: number;
  currentlyTyping: UserTyping[] = [];

  @session.State("userId") userId: string;
  @users.State("typing") typing: UserTyping[];
  @users.Getter("byId") getUser: (id: string) => User;

  mounted(): void {
    this.timerId = window.setInterval(this.update, 1000);
  }

  beforeDestroy(): void {
    clearInterval(this.timerId);
  }

  update() {
    const now = Date.now();
    this.currentlyTyping = this.typing.filter(
      (typing) =>
        typing.id !== this.userId && typing.lastTypingTime + 5000 > now
    );
  }

  get userTypingText(): string {
    if (this.currentlyTyping.length > 3) {
      return `${this.currentlyTyping.length} users`;
    } else {
      return this.currentlyTyping
        .map((typing) => this.getUser(typing.id)?.name ?? "{unknown}")
        .join(", ");
    }
  }
}
</script>
