<template>
  <div class="typing-bar">
    <span
      :style="`display: flex; align-items: baseline;` + (userTypings.length > 0 ? '' : 'visibility: hidden;')"
    >
      <i class="icon fas fa-ellipsis-h" />
      {{ `${userTypingText} ${userTypings.length === 1 ? "is" : "are"} typing...` }}
    </span>
  </div>
</template>

<script lang="ts">
import Vue from "vue";
import Component from "vue-class-component";
import { UserTyping } from "@/models/events";
import { Prop } from "vue-property-decorator";
import userTypingStore from "@/store/user-typing-store";
import userStore from "@/store/user-store";

@Component({})
export default class TypingBar extends Vue {
  private dispose: () => void;
  private timerId: number;

  @Prop() currentUserId;

  userTypings: UserTyping[] = [];
  amountOfUsersTyping = 0;

  mounted(): void {
    this.dispose = userTypingStore.onUpdate(this.update);
    this.timerId = window.setInterval(this.update, 5000);
  }

  beforeDestroy(): void {
    this.dispose();
    clearInterval(this.timerId);
  }

  update(): void {
    this.userTypings = userTypingStore
      .list()
      .filter((x: UserTyping) => x.id != this.currentUserId)
      .filter((x: UserTyping) => x.lastTypingTime + 5000 > Date.now());
  }

  get userTypingText(): string {
    if (this.userTypings.length > 3) {
      return `${this.amountOfUsersTyping} users`;
    }

    let allUsers = userTypingStore.list();

    return allUsers
      .filter((x: UserTyping) => x.id != this.currentUserId)
      .filter((x: UserTyping) => x.lastTypingTime + 5000 > Date.now())
      .map((x: UserTyping) => userStore.get(x.id)?.name || "{unknown}")
      .join(", ");
  }
}
</script>
