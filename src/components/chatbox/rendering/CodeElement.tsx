import React from "react";
import { Text } from "@chakra-ui/react";

export const CodeElement = ({ attributes, children }) => {
  return (
    <Text as="code" {...attributes} bg="dark.10" px="1" fontSize="xs">
      {children}
    </Text>
  );
};
