import logo from "../../static/logo.svg";

import { Img } from "@chakra-ui/image";
import { Box, Button, Flex, Icon, Spinner, Text } from "@chakra-ui/react";
import React, { useEffect, useRef, useState } from "react";
import QrCodeWithLogo from "qrcode-with-logos";
import { RootState } from "@/store";
import { connect } from "react-redux";
import { FaExclamationTriangle } from "react-icons/fa";

interface Props {
  token?: string;
}

const UserQrCode = ({ token }: Props) => {
  const [dataUri, setDataUri] = useState("");
  const [showToken, setShowToken] = useState(false);

  console.log(logo);
  useEffect(() => {
    new QrCodeWithLogo({
      content: token,
      logo: {
        src: logo,
        borderColor: "#ed486c"
      },
      nodeQrCodeOptions: {
        color: {
          dark: "#fff",
          light: "#ed486c"
        },
        margin: 3
      }
    })
      .getCanvas()
      .then(x => setDataUri(x.toDataURL()));
  }, []);

  return (
    <Flex w="full" my="4">
      {dataUri.length == 0 ? (
        <Spinner />
      ) : (
        <Box
          overflow="hidden"
          mr="8"
          style={{
            filter: !showToken && "blur(8px)"
          }}
        >
          <Img boxSize="xxs" src={dataUri} borderRadius="lg" />
        </Box>
      )}
      <Box>
        <Text maxW="md">
          To authorize your account, we provide you with a QR code that you can
          use to scan on other devices. Keep this code secure, your credentials
          are inside of the code.
        </Text>
        <Button
          mt="4"
          px="4"
          size="sm"
          onClick={() => setShowToken(!showToken)}
          leftIcon={!showToken && <Icon as={FaExclamationTriangle} />}
          bg={showToken ? "gray.500" : "red.500"}
        >
          {showToken ? "Hide Token" : "Show Token"}
        </Button>
      </Box>
    </Flex>
  );
};

const mapStateToProps = (state: RootState): Props => {
  return {
    token: state.sessions.token
  };
};

export default connect(mapStateToProps)(UserQrCode);
