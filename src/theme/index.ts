import { extendTheme } from "@chakra-ui/react";

import colors from "./foundations/colors";
import { spacing } from "./foundations/spacing";
import sizes from "./foundations/sizes";
import typography from "./foundations/typography";

import Alert from "./components/Alert";
import Avatar from "./components/Avatar";
import Badge from "./components/Badge";
import Button from "./components/Button";
import Modal from "./components/Modal";

export default extendTheme({
  colors,
  components: {
    Alert,
    Avatar,
    Badge,
    Button,
    Modal,
  },
  fonts: {
    body: "Open Sans",
    heading: "Open Sans",
  },
  shadows: {
    outline: `0 0 0 2px ${colors.accent}`,
  },
  sizes,
  space: spacing,
  styles: {
    global: {
      a: {
        color: "accent",
        _hover: {
          textDecoration: "underline",
        },
      },
      body: {
        bg: "background.dark",
      },
    },
  },
  ...typography,
});
