<template>
  <div class="typing-bar">
    <span
      :style="`display: flex; align-items: baseline;` + (isTyping() ? '' : 'visibility: hidden;')"
    >
      <i class="icon fas fa-ellipsis-h"></i>
      <p>{{`${getUsersTyping()} ${amountTyping() == 1 ? "is" : "are"} typing...`}}</p>
    </span>
  </div>
</template>

<script lang="ts">
import Vue from "vue";
import Component from "vue-class-component";
import { UserTyping } from "../models/events";
import { Prop, Provide } from "vue-property-decorator";
import userTypingStore from "../store/user-typing-store";
import userStore from "../store/user-store";

@Component({})
export default class TypingBar extends Vue {
  @Prop()
  currentUserId: string;

  @Provide()
  usersTyping: string;

  @Provide()
  amountOfUsersTyping: number;

  constructor() {
    super();
    this.amountOfUsersTyping = 0;

    userTypingStore.onUpdate(async () => {
      this.amountOfUsersTyping = this.amountTyping();
      this.usersTyping = this.getUsersTyping();

      this.$forceUpdate();
    });

    setInterval(() => {
      if (this.amountOfUsersTyping != 0) {
        this.$forceUpdate();
      }
    }, 5000);
  }

  amountTyping(): number {
    return userTypingStore
      .list()
      .filter((x: UserTyping) => x.id != this.currentUserId)
      .filter((x: UserTyping) => x.lastTypingTime + 5000 > Date.now()).length;
  }

  isTyping(): boolean {
    return this.amountTyping() > 0;
  }

  getUsersTyping(): string {
    if (this.amountTyping() > 3) {
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