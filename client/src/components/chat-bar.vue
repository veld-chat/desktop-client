<template>
  <div class="controls-wrapper">
    <div class="controls">
      <div
        v-show="autoComplete.length > 0"
        ref="container"
        class="autocomplete"
      >
        <div
          v-for="(item, index) in autoComplete"
          :key="item.text"
          :class="['autocomplete-item', autoCompleteIndex === index && 'active', item.class]"
          @click="handleAutoComplete(index)"
        >
          <img
            v-if="item.image"
            :src="item.image"
            class="autocomplete-image"
            alt="Image"
          >
          <div
            v-if="item.avatar"
            class="autocomplete-avatar"
            :style="{backgroundImage: `url('${item.avatar}')`}"
          />

          {{ item.emoji }} {{ item.text }}
          <span
            v-show="item.description"
            class="autocomplete-description"
          >- {{ item.description }}</span>
        </div>
      </div>
      <textarea
        id="ui-input-field"
        ref="input"
        :placeholder="ready ? `type your message here!` : `connecting...`"
        class="textfield"
        maxlength="256"
        :disabled="!ready"
      />
      <a
        class="sendbutton flex-end"
        @click="send()"
      >
        <i class="fas fa-paper-plane" />
      </a>
    </div>
    <typing-bar :current-user-id="currentUserId" />
  </div>
</template>

<script lang="ts">
import Vue from "vue";
import { Component, Ref } from "vue-property-decorator";
import TypingBar from "./typing-bar.vue";
import { emojis } from "@/utils/emoji";
import userStore from "@/store/user-store";
const HyperMD = process.isClient ? require("../hypermd") : null;
const CodeMirror = process.isClient ? require("codemirror") : null;

interface AutoComplete {
  text: string;
  textLowerCased: string;
  emoji?: string;
  image?: string;
  avatar?: string;
  value: string;
  description?: string;
}

const dictionary: AutoComplete[] = [];

for (const n of Object.keys(emojis)) {
  dictionary.push({
    text: n,
    textLowerCased: n,
    image: emojis[n].image,
    value: `:${n}:`,
  });
}

dictionary.push({
  text: "avatar",
  textLowerCased: "avatar",
  value: `/avatar`,
  description: "Changes your avatar to a random avatar.",
});

dictionary.push({
  text: "nick",
  textLowerCased: "nick",
  value: `/nick`,
  description: "Changes your nickname.",
});

@Component({
  props: ["ready", "currentUserId"],
  components: { TypingBar },
})
export default class ChatBar extends Vue {
  @Ref() input: HTMLTextAreaElement;
  @Ref() container: HTMLDivElement;
  message = "";
  lastTimeTyping = 0;
  editor: CodeMirror.Editor;
  autoComplete: AutoComplete[] = [];
  autoCompleteIndex = 0;
  from: CodeMirror.Position;
  to: CodeMirror.Position;

  mounted(): void {
    if (process.isClient) {
      this.editor = HyperMD.fromTextArea(this.input, {
        theme: "hypermd-light",
        placeholder: "Send a message",
        scrollbarStyle: "null",
        lineNumbers: false,
        viewportMargin: Infinity,
        autoCloseBrackets: false,
        extraKeys: {
          Enter: this.handleEnter,
          Up: this.moveUp,
          Down: this.moveDown,
          Tab: this.handleTab,
        },
      });

      this.editor.on("cursorActivity", this.handleCursorChange);
    }
  }

  handleCursorChange(cm: CodeMirror.Editor) {
    const { list, to, from } = this.handleHint(cm);

    this.from = from;
    this.to = to;
    this.autoComplete = list;

    if (list.length > 0 && this.autoCompleteIndex >= list.length) {
      this.autoCompleteIndex = list.length - 1;
    }

    this.startTyping();
  }

  handleAutoComplete(index?: number) {
    if (this.autoComplete.length === 0) {
      return false;
    }

    const item = this.autoComplete[index ?? this.autoCompleteIndex];

    this.editor.replaceRange(item.value + " ", this.from, this.to);
    this.editor.setCursor(this.to.ch + item.value.length + 1);
    this.editor.focus();

    return true;
  }

  handleEnter() {
    if (!this.handleAutoComplete()) {
      this.send();
    }
  }

  handleTab() {
    if (!this.handleAutoComplete()) {
      return CodeMirror.Pass;
    }
  }

  moveDown() {
    if (this.autoComplete.length === 0) {
      return CodeMirror.Pass;
    }

    this.autoCompleteIndex++;

    if (this.autoCompleteIndex >= this.autoComplete.length) {
      this.autoCompleteIndex = 0;
    }

    this.moveToItem();
  }

  moveUp() {
    if (this.autoComplete.length === 0) {
      return CodeMirror.Pass;
    }

    this.autoCompleteIndex--;

    if (this.autoCompleteIndex < 0) {
      this.autoCompleteIndex = this.autoComplete.length - 1;
    }

    this.moveToItem();
  }

  moveToItem() {
    this.$nextTick(() => {
       const element = this.container.querySelector(".active");

       if (element) {
         element.scrollIntoView({ block: "center" });
       }
    })
  }

  handleHint(cm: CodeMirror.Editor) {
    const cursor = cm.getCursor(),
      line = cm.getLine(cursor.line);
    let start = cursor.ch,
      end = cursor.ch;
    while (start && line.charAt(start - 1) !== " ") --start;
    while (end < line.length && line.charAt(end) !== " ") ++end;

    if (start === end) {
      return {
        list: [],
        from: CodeMirror.Pos(cursor.line, start),
        to: CodeMirror.Pos(cursor.line, end),
      };
    }

    const word = line.slice(start, cursor.ch).toLowerCase();
    const wordEmpty = word.length === 0;
    const result = {
      list: [] as AutoComplete[],
      from: CodeMirror.Pos(cursor.line, start),
      to: CodeMirror.Pos(cursor.line, end),
    };

    for (let i = 0; i < dictionary.length; i++) {
      const emoji = dictionary[i];

      if (wordEmpty || emoji.value.slice(0, word.length) === word) {
        result.list.push(emoji);

        if (result.list.length >= 50) {
          break;
        }
      }
    }

    if (word[0] === "@") {
      const name = word.substr(1);
      const visited = [];

      for (const item of userStore.list()) {
        const itemName = item.name.toLowerCase();

        if (visited.indexOf(itemName) !== -1) {
          continue;
        }

        visited.push(itemName);

        if (itemName.slice(0, name.length).toLowerCase() === name) {
          result.list.push({
            text: item.name,
            textLowerCased: item.name.toLowerCase(),
            avatar: item.avatarUrl,
            value: "@" + item.name,
          });

          if (result.list.length >= 50) {
            break;
          }
        }
      }
    }

    result.list = result.list.sort((a,b) => (a.textLowerCased > b.textLowerCased)
      ? 1
      : ((b.textLowerCased > a.textLowerCased) ? -1 : 0));

    return result;
  }

  startTyping(): void {
    if (this.lastTimeTyping + 5000 > new Date().getTime()) {
      return;
    }

    this.lastTimeTyping = new Date().getTime();
    this.$emit("startTyping");
  }

  send(): void {
    this.$emit("send", this.editor.getValue());
    this.editor.setValue("");
    this.editor.focus();
  }
}
</script>
