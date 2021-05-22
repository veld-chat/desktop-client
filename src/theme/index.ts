import { extendTheme } from "@chakra-ui/react";
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
    Button,
  },
  fonts: {
    body: "Motiva Sans",
    heading: "Motiva Sans",
  },
  styles: {
    global: {
      a: {
        color: "primary.500",
        _hover: {
          textDecoration: "underline",
        },
      },
    },
  },
  colors: {
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
});
