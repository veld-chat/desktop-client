import logo from "../../static/logo.svg";

import { Img } from "@chakra-ui/image";
import {
  Box,
  Button,
  Flex,
  Icon,
  Spinner,
  Text,
  VStack,
} from "@chakra-ui/react";
import React, { useEffect, useRef, useState } from "react";
import QrCodeWithLogo from "qrcode-with-logos";
import { RootState } from "../store";
import { connect } from "react-redux";
import { FaExclamationTriangle } from "react-icons/fa";

interface Props {
  token?: string;
}

const UserQrCode = ({ token }: Props) => {
  const [dataUri, setDataUri] = useState("");
  const [showToken, setShowToken] = useState(false);

  useEffect(() => {
    new QrCodeWithLogo({
      content: token,
      logo: {
        src: logo,
        borderColor: "#ed486c",
      },
      nodeQrCodeOptions: {
        color: {
          dark: "#fff",
          light: "#ed486c",
        },
        margin: 3,
      },
    })
      .getCanvas()
      .then((x) => setDataUri(x.toDataURL()));
  }, []);

  return (
    <Flex w="full" my="4">
      {dataUri.length == 0 ? (
        <Spinner />
      ) : (
        <Box
          overflow="hidden"
          mr="32"
          style={{
            filter: !showToken && "blur(8px)",
          }}
        >
          <Img boxSize="xxs" src={dataUri} borderRadius="lg" />
        </Box>
      )}
      <VStack spacing="8" align="flex-start">
        <Text maxW="md">
          To authorize your account, we provide you with a QR code that you can
          use to scan on other devices. Keep this code secure, your credentials
          are inside of the code.
        </Text>
        <Button
          onClick={() => setShowToken(!showToken)}
          leftIcon={!showToken && <Icon as={FaExclamationTriangle} />}
          bg={showToken ? "bright.10" : "system.error"}
          _hover={{
            bg: `${showToken ? "bright.20" : "system.error"}`,
          }}
        >
          {showToken ? "Hide Token" : "Show Token"}
        </Button>
      </VStack>
    </Flex>
  );
};

const mapStateToProps = (state: RootState): Props => {
  return {
    token: state.sessions.token,
  };
};

export default connect(mapStateToProps)(UserQrCode);
