import { extendTheme } from "@chakra-ui/react";

import { spacing } from "./foundations/spacing";
import sizes from "./foundations/sizes";
import typography from "./foundations/typography";

import Avatar from "./components/Avatar";
import Button from "./components/Button";

const Alert = {
  parts: ["alert"],
  baseStyle: {
    alert: {
      backdropFilter: "blur(4px)",
    },
  },
};

export default extendTheme({
  components: {
    Alert,
    Avatar,
    Button,
  },
  fonts: {
    body: "Open Sans",
    heading: "Open Sans",
  },
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
  colors: {
    bright: {
      100: "rgba(255, 255, 255, 1.0)",
      80: "rgba(255, 255, 255, 0.8)",
      60: "rgba(255, 255, 255, 0.6)",
      40: "rgba(255, 255, 255, 0.4)",
      20: "rgba(255, 255, 255, 0.2)",
      10: "rgba(255, 255, 255, 0.1)",
    },
    dark: {
      100: "rgba(0, 0, 0, 1.0)",
      80: "rgba(0, 0, 0, 0.8)",
      60: "rgba(0, 0, 0, 0.6)",
      40: "rgba(0, 0, 0, 0.4)",
      20: "rgba(0, 0, 0, 0.2)",
      10: "rgba(0, 0, 0, 0.1)",
    },
    background: {
      dark: "#303136",
      darkSecondary: "#26282D",
    },
    accent: "#F6216E",
    system: {
      error: "#EB496A",
      warning: "#49BFEB",
      success: "#49EB74",
      info: "#F9D725",
    },
    white: "#fff",
    black: "#000",
    gray: {
      900: "#000000",
      800: "#212121",
      700: "#26272b",
      600: "#303136",
      500: "#3d3e43",
      400: "#6D707D",
      300: "#7f8694",
      200: "#cdd3dd",
      100: "#ffffff",
    },
    green: {
      100: "#d2f8da",
      200: "#a5f2b5",
      300: "#79eb8f",
      400: "#4ce56a",
      500: "#1fde45",
      600: "#19b237",
      700: "#138529",
      800: "#0c591c",
      900: "#062c0e",
    },
    blue: {
      100: "#d6e1fb",
      200: "#adc2f8",
      300: "#84a4f4",
      400: "#5b85f1",
      500: "#327ded",
      600: "#2852be",
      700: "#1e3e8e",
      800: "#14295f",
      900: "#0a152f",
    },
    red: {
      100: "#fbdae2",
      200: "#f8b6c4",
      300: "#f491a7",
      400: "#f16d89",
      500: "#ed486c",
      600: "#be3a56",
      700: "#8e2b41",
      800: "#5f1d2b",
      900: "#2f0e16",
    },
  },
  sizes,
  space: spacing,
  ...typography,
});
