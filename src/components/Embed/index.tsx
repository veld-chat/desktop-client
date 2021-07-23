import { Box, Flex, Img, Text, VStack } from "@chakra-ui/react";
import React from "react";
import { Embed as EmbedModel } from "../../models";
import { ModalledImg } from "../ModalImg";

interface Props {
  value: EmbedModel;
}

export const Embed = ({ value }: Props) => {
  return (
    <VStack
      borderRadius="lg"
      overflow="hidden"
      bg="dark.20"
      p="16"
      maxW="340px"
      alignItems="flex-start"
      w="full"
      spacing="16"
    >
      <Flex justify="space-between">
        <Box>
          {value.author && (
            <Flex mb="8" align="flex-end">
              <Img
                maxH="16"
                borderRadius="full"
                mr="8"
                src={value.author.iconUrl}
              />
              <Text
                fontSize="paragraph.medium"
                dangerouslySetInnerHTML={{ __html: value.author.value }}
              />
            </Flex>
          )}
          {value.title && (
            <Text
              fontSize="paragraph.medium"
              mb="8"
              dangerouslySetInnerHTML={{ __html: value.title }}
            />
          )}
          {value.description && (
            <Text
              fontSize="paragraph.small"
              dangerouslySetInnerHTML={{ __html: value.description }}
            />
          )}
        </Box>
        {value.imageUrl && (
          <ModalledImg src={value.imageUrl} w="64" h="64" borderRadius="lg" />
        )}
      </Flex>
      {value.footer && (
        <Text
          fontSize="xs"
          mt="1"
          color="bright.60"
          dangerouslySetInnerHTML={{ __html: value.footer }}
        />
      )}
      {value.thumbnailUrl && (
        <ModalledImg
          src={value.thumbnailUrl}
          w="full"
          maxH="96px"
          borderRadius="lg"
        />
      )}
    </VStack>
  );
};
