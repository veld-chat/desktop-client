<template>
  <div class="controls-wrapper">
    <div class="controls">
      <div class="autocomplete">
        <div
          v-for="(item, index) in autoComplete"
          :key="item.name"
          :class="['autocomplete-item', autoCompleteIndex === index && 'active']"
        >{{ item.emoji }} {{ item.name }}</div>
      </div>
      <textarea
        id="ui-input-field"
        ref="input"
        :placeholder="ready ? `type your message here!` : `connecting...`"
        class="textfield"
        maxlength="256"
        :disabled="!ready"
      />
      <a class="sendbutton flex-end" @click="send()">
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

const HyperMD = process.isClient ? require("hypermd") : null;
const CodeMirror = process.isClient ? require("codemirror") : null;

const dictionary: Emoji[] = [];

interface Emoji {
  name: string;
  emoji: string;
  value: string;
}

for (const n of Object.keys(emojis)) {
  dictionary.push({
    name: n,
    emoji: emojis[n],
    value: `:${n}:`,
  });
}

@Component({
  props: ["ready", "currentUserId"],
  components: { TypingBar },
})
export default class ChatBar extends Vue {
  @Ref() input: HTMLTextAreaElement;
  message = "";
  lastTimeTyping = 0;
  editor: CodeMirror.Editor;
  autoComplete: Emoji[] = [];
  autoCompleteIndex = 0;
  from: CodeMirror.Position;
  to: CodeMirror.Position;

  mounted(): void {
    if (process.isClient) {
      this.editor = HyperMD.fromTextArea(this.input, {
        theme: "hypermd-light",
        scrollbarStyle: "null",
        lineNumbers: false,
        viewportMargin: Infinity,
        extraKeys: {
          Enter: this.handleEnter,
          Up: this.moveUp,
          Down: this.moveDown,
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

  handleEnter() {
    if (this.autoComplete.length > 0) {
      const item = this.autoComplete[this.autoCompleteIndex];

      this.editor.replaceRange(item.value + " ", this.from, this.to);
      this.editor.setCursor(this.to.ch + item.value.length + 1);
    } else {
      this.send();
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
  }

  moveUp() {
    if (this.autoComplete.length === 0) {
      return CodeMirror.Pass;
    }

    this.autoCompleteIndex--;

    if (this.autoCompleteIndex < 0) {
      this.autoCompleteIndex = this.autoComplete.length - 1;
    }
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
      list: [],
      from: CodeMirror.Pos(cursor.line, start),
      to: CodeMirror.Pos(cursor.line, end),
    };

    for (let i = 0; i < dictionary.length; i++) {
      const emoji = dictionary[i];

      if (wordEmpty || emoji.value.slice(0, word.length) === word) {
        result.list.push(emoji);

        if (result.list.length >= 5) {
          break;
        }
      }
    }

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
  }
}
</script>
