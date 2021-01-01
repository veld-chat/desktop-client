<template>
  <div
    ref="wrapper"
    class="controls-wrapper"
  >
    <div class="controls">
      <div
        v-show="autoComplete.length > 0"
        ref="container"
        class="autocomplete"
      >
        <div
          v-for="(item, index) in autoComplete"
          :key="item.text"
          :class="['autocomplete-item', autoCompleteIndex === index && 'active']"
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
    <typing-bar />
  </div>
</template>

<script lang="ts">
import Vue from "vue";
import { Component, Ref } from "vue-property-decorator";
import TypingBar from "./typing-bar.vue";
import { autoComplete, AutoComplete } from "@/utils/autocomplete";
// import { connection } from "@/connection";
import { namespace } from "vuex-class";
const HyperMD = process.isClient ? require("../hypermd") : null;
const CodeMirror = process.isClient ? require("codemirror") : null;
import { client } from "../api-client";

const channels = namespace("channels");

@Component({
  components: { TypingBar },
})
export default class ChatBar extends Vue {
  @Ref() input: HTMLTextAreaElement;
  @Ref() container: HTMLDivElement;
  @Ref() wrapper: HTMLDivElement;

  @channels.State("currentChannel") currentChannel: string;
  message = "";
  lastTimeTyping = 0;
  ready = true;
  editor: CodeMirror.Editor;
  autoComplete: AutoComplete[] = [];
  autoCompleteIndex = 0;
  word: string;
  from: CodeMirror.Position;
  to: CodeMirror.Position;
  shift: boolean;

  mounted(): void {
    if (!process.isClient) {
      return;
    }

    this.editor = HyperMD.fromTextArea(this.input, {
      theme: "hypermd-dark",
      placeholder: "Send a message",
      scrollbarStyle: "null",
      lineNumbers: false,
      viewportMargin: Infinity,
      autoCloseBrackets: false,
      highlightFormatting: true,
      extraKeys: {
        Enter: this.handleEnter,
        Up: this.moveUp,
        Down: this.moveDown,
        Tab: this.handleTab,
        "Shift-Enter": this.handleShiftEnter,
      },
    });

    this.editor.on("cursorActivity", this.handleCursorChange);

    new ResizeObserver(() => {
      this.$emit("height", this.wrapper.clientHeight);
    }).observe(this.wrapper);

    document.addEventListener("click", this.handleClick);
    document.addEventListener("keyup", this.handleKeyPress);
    document.addEventListener("keydown", this.handleKeyPress);
  }

  beforeDestroy() {
    if (!process.isClient) {
      return;
    }

    document.removeEventListener("click", this.handleClick);
    document.removeEventListener("keyup", this.handleKeyPress);
    document.removeEventListener("keydown", this.handleKeyPress);
  }

  private handleClick(e: MouseEvent) {
    const element = e.target as HTMLImageElement;

    if (
      element &&
      element.tagName === "IMG" &&
      element.classList.contains("emoji")
    ) {
      if (!this.editor.hasFocus()) {
        this.editor.focus();
      }

      this.editor.replaceSelection(element.alt + " ");
      this.editor.focus();
    }
  }

  private handleKeyPress(e: KeyboardEvent) {
    this.shift = e.shiftKey;
  }

  handleCursorChange(cm: CodeMirror.Editor) {
    const { list, to, from, word } = this.handleHint(cm);

    this.word = word;
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
    let result = item.value + " ";

    if (this.shift) {
      result += this.word;
    }

    this.editor.replaceRange(result, this.from, this.to);
    this.editor.setCursor(this.to.ch + item.value.length + 1);
    this.editor.focus();

    return true;
  }

  handleEnter() {
    if (!this.handleAutoComplete()) {
      this.send();
    }
  }

  handleShiftEnter() {
    if (!this.handleAutoComplete()) {
      return CodeMirror.Pass;
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
    });
  }

  handleHint(cm: CodeMirror.Editor) {
    const cursor = cm.getCursor();
    const line = cm.getLine(cursor.line);
    let start = cursor.ch;
    let end = cursor.ch;
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

    return {
      word,
      list: autoComplete(word),
      from: CodeMirror.Pos(cursor.line, start),
      to: CodeMirror.Pos(cursor.line, end),
    };
  }

  startTyping(): void {
    if (this.lastTimeTyping + 5000 > new Date().getTime()) {
      return;
    }

    this.lastTimeTyping = new Date().getTime();
    //  connection.emit("user:typing");
  }

  async send() {
    const message = this.editor.getValue();
    if (message.trim().length == 0) {
      return;
    }

    this.editor.setValue("");
    await client().sendMessage(this.currentChannel, message);

    this.editor.focus();
  }
}
</script>
