import React from "react";
import { Text } from "@chakra-ui/react";

export const Leaf = ({ leaf, attributes, children }) => {
  return (
    <Text
      fontSize="paragraph.small"
      textDecoration={leaf.underlined ? "underline" : undefined}
      fontStyle={leaf.italic ? "italic" : undefined}
      fontWeight={leaf.bold ? "bold" : undefined}
      bg={leaf.code ? "gray.700" : undefined}
      borderLeft={leaf.blockquote ? "2px solid" : undefined}
      px={leaf.code ? "1" : undefined}
      {...attributes}
      as={leaf.code ? "code" : "span"}
    >
      {children}
    </Text>
  );
};
