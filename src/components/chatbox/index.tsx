import "../../style/editor.scss";

import Prism from "prismjs";
import "../../prismjs/languages/markdown";

import { client } from "../../api-client";
import { RootState } from "../../store";
import { Box, Flex } from "@chakra-ui/react";
import React, { useCallback, useMemo, useState } from "react";
import { connect } from "react-redux";
import { Editable, ReactEditor, Slate, withReact } from "slate-react";
import { createEditor, Text } from "slate";
import { SlateElement } from "./types";
import { serialize } from "./serializer";
import { createInputHandler } from "./inputHandler";
import { Leaf } from "./rendering/Leaf";
import { Channel } from "../../models";

interface Props {
  currentChannel?: Channel;
}

const initialState = (): SlateElement[] => [
  {
    type: "paragraph",
    children: [{ text: "" }],
  },
];

const ChatBox = ({ currentChannel }: Props) => {
  const [value, setValue] = useState<SlateElement[]>(initialState());
  const editor = useMemo(() => withReact(createEditor()), []);
  const decorate = useCallback(([node, path]) => {
    const ranges = [];

    if (!Text.isText(node)) {
      return ranges;
    }

    const getLength = (token) => {
      if (typeof token === "string") {
        return token.length;
      } else if (typeof token.content === "string") {
        return token.content.length;
      } else {
        return token.content.reduce((l, t) => l + getLength(t), 0);
      }
    };

    const tokens = Prism.tokenize(node.text, Prism.languages.markdown);
    let start = 0;

    for (const token of tokens) {
      const length = getLength(token);
      const end = start + length;

      if (typeof token !== "string") {
        ranges.push({
          [token.type]: true,
          anchor: { path, offset: start },
          focus: { path, offset: end },
        });
      }

      start = end;
    }

    return ranges;
  }, []);

  const renderLeaf = useCallback((props) => {
    return <Leaf {...props} />;
  }, []);

  const sendMessage = async () => {
    const content = serialize(value).trim();
    if (content.length == 0) {
      return;
    }

    editor.selection = {
      anchor: { path: [0, 0], offset: 0 },
      focus: { path: [0, 0], offset: 0 },
    };
    setValue(initialState());

    await client().sendMessage(currentChannel?.id, content);
    ReactEditor.focus(editor);
  };

  const handleInput = createInputHandler(editor, {
    onSubmit: sendMessage,
  });

  return (
    <Flex
      w="full"
      background="bright.10"
      borderRadius="4"
      px="16"
      py="12"
      justifyContent="space-between"
      align="center"
    >
      <Box
        flex="1"
        fontSize="paragraph.small"
        overflowX="hidden"
        whiteSpace="pre-wrap"
      >
        <Slate
          editor={editor}
          value={value}
          onChange={(value: SlateElement[]) => setValue(value)}
        >
          <Editable
            placeholder={`Message #${currentChannel?.name}`}
            decorate={decorate}
            renderLeaf={renderLeaf}
            onKeyDown={(e) => handleInput(e)}
          />
        </Slate>
      </Box>
    </Flex>
  );
};

const mapStateToProps = (state: RootState): Props => {
  return {
    currentChannel: state.channels.channelsById[state.channels.currentChannel],
  };
};

export default connect(mapStateToProps)(ChatBox);
