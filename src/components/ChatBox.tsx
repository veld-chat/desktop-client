import "codemirror/lib/codemirror.css";
import "../style/editor.scss";

if (typeof window !== "undefined") {
  require("hypermd/mode/hypermd");
}

import { client } from "../api-client";
import { RootState } from "../store";
import {
  Avatar,
  Box,
  Flex,
  IconButton,
  Img,
  SlideFade,
  Text,
} from "@chakra-ui/react";
import React, { useEffect, useRef, useState } from "react";
import { connect } from "react-redux";
import { UnControlled as CodeMirrorField } from "react-codemirror2";
import type { Editor } from "codemirror";
import { FaPaperPlane } from "react-icons/fa";
import {
  autoComplete as performAutoComplete,
  AutoComplete,
} from "../utils/autocomplete";

const { Pos, Pass } =
  typeof window === "undefined" ? { Pos: 0, Pass: 1 } : require("codemirror");

interface Props {
  currentChannel?: string;
}

const ChatBox = ({ currentChannel }: Props) => {
  const ref = useRef<HTMLDivElement>();
  const [editor, setEditor] = useState<Editor>();
  const [shift, setShift] = useState(false);
  const [autoCompleteIndex, setAutoCompleteIndex] = useState(0);
  const [word, setWord] = useState("");
  const [from, setFrom] = useState<any>();
  const [to, setTo] = useState<any>();
  const [autoComplete, setAutoComplete] = useState<AutoComplete[]>([]);

  useEffect(() => {
    ref.current?.scrollIntoView({ block: "center" });
  }, [autoCompleteIndex]);

  const handleHint = (cm: Editor) => {
    const cursor = cm.getCursor();
    const line = cm.getLine(cursor.line);
    let start = cursor.ch;
    let end = cursor.ch;
    while (start && line.charAt(start - 1) !== " ") --start;
    while (end < line.length && line.charAt(end) !== " ") ++end;

    if (start === end) {
      return {
        list: [],
        from: Pos(cursor.line, start),
        to: Pos(cursor.line, end),
      };
    }

    const word = line.slice(start, cursor.ch).toLowerCase();

    const list = performAutoComplete(word);

    return {
      word,
      list,
      from: Pos(cursor.line, start),
      to: Pos(cursor.line, end),
    };
  };

  const handleCursorChange = (cm: Editor) => {
    const { list, to, from, word } = handleHint(cm);

    setWord(word);
    setFrom(from);
    setTo(to);
    setAutoComplete(list);

    if (list.length > 0 && autoCompleteIndex >= list.length) {
      setAutoCompleteIndex(list.length - 1);
    }
  };

  const handleAutoComplete = (index?: number) => {
    if (autoComplete.length === 0) {
      return false;
    }

    const item = autoComplete[index ?? autoCompleteIndex];
    let result = item.value + " ";

    if (shift) {
      result += word;
    }

    editor.replaceRange(result, from, to);
    editor.setCursor(to.ch + item.value.length + 1);
    editor.focus();

    return true;
  };

  const handleKeyPress = (_: Editor, e: KeyboardEvent) => {
    setShift(e.shiftKey);
  };

  const handleEnter = () => {
    if (!handleAutoComplete()) {
      sendMessage();
    }
  };

  const handleShiftEnter = () => {
    if (!handleAutoComplete()) {
      return Pass;
    }
  };

  const handleTab = () => {
    if (!handleAutoComplete()) {
      return Pass;
    }
  };

  const moveDown = () => {
    if (autoComplete.length === 0) {
      return Pass;
    }

    setAutoCompleteIndex(
      autoCompleteIndex >= autoComplete.length - 1 ? 0 : autoCompleteIndex + 1
    );
  };

  const moveUp = () => {
    if (autoComplete.length === 0) {
      return Pass;
    }

    setAutoCompleteIndex(
      autoCompleteIndex > 0 ? autoCompleteIndex - 1 : autoComplete.length - 1
    );
  };

  const sendMessage = async () => {
    const message = editor.getValue();
    if (message.trim().length == 0) {
      return;
    }

    editor.setValue("");
    await client().sendMessage(currentChannel, message);

    editor.focus();
  };

  return (
    <Flex
      w="full"
      mb="4"
      background="gray.500"
      borderRadius="lg"
      p="2"
      justifyContent="space-between"
      position="relative"
    >
      <Box
        position="absolute"
        bottom={34 + editor?.lineCount() * 17 + "px"}
        left="0px"
        w="full"
        zIndex={autoComplete.length > 0 ? "popover" : 0}
      >
        <SlideFade in={autoComplete.length > 0} reverse offsetY="20px">
          <Box
            w="full"
            bg="gray.700"
            borderRadius="lg"
            h="100px"
            overflowY="auto"
            p="2"
          >
            {autoComplete.map((x, i) => (
              <Flex
                borderRadius="md"
                id={x.textLowerCased}
                ref={i == autoCompleteIndex ? ref : undefined}
                bg={i == autoCompleteIndex ? "gray.500" : "transparent"}
                justify="align-between"
                w="full"
              >
                <Flex m="1">
                  {x.avatar && <Avatar size="xs" src={x.avatar} />}
                  {x.image && <Img boxSize="14px" src={x.image} />}
                  <Text fontSize="sm" pl="2">
                    {x.text}
                  </Text>
                </Flex>
                <Text>{x.description}</Text>
              </Flex>
            ))}
          </Box>
        </SlideFade>
      </Box>
      <Box flex="1" fontSize="sm" overflowX="hidden" whiteSpace="pre-wrap">
        <CodeMirrorField
          options={{
            mode: "hypermd",
            autocorrect: true,
            spellcheck: true,
            scrollbarStyle: "null",
            lineNumbers: false,
            viewportMargin: Infinity,
            autoCloseBrackets: false,
            lineWrapping: true,
            extraKeys: {
              Enter: handleEnter,
              Up: moveUp,
              Down: moveDown,
              Tab: handleTab,
              "Shift-Enter": handleShiftEnter,
            },
          }}
          onKeyDown={handleKeyPress}
          onKeyUp={handleKeyPress}
          onCursorActivity={handleCursorChange}
          editorDidMount={(editor) => setEditor(editor)}
        />
      </Box>
      <IconButton
        size="xs"
        background="transparent"
        aria-label="send"
        icon={<FaPaperPlane />}
        onClick={sendMessage}
        zIndex="overlay"
      />
    </Flex>
  );
};

const mapStateToProps = (state: RootState): Props => {
  return {
    currentChannel: state.channels.currentChannel,
  };
};

export default connect(mapStateToProps)(ChatBox);
