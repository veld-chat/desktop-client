import store from "../store/store";
import { ChakraProvider, ColorModeProvider, CSSReset } from "@chakra-ui/react";
import React, { PropsWithChildren } from "react";
import { Provider } from "react-redux";
import theme from "../theme";

export const Layout = ({ children }: PropsWithChildren<{}>) => (
  <Provider store={store}>
    <ChakraProvider theme={theme}>
      <CSSReset />
      <ColorModeProvider
        options={{ useSystemColorMode: true, initialColorMode: "dark" }}
      >
        {children}
      </ColorModeProvider>
    </ChakraProvider>
  </Provider>
);
