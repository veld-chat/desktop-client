import { Box, Flex, Img, Text } from "@chakra-ui/react";
import React from "react";
import { Embed as EmbedModel } from "../models";
import { ModalledImg } from "./ModalImg";

interface Props {
  value: EmbedModel;
}

export const Embed = ({ value }: Props) => {
  return (
    <Box
      bg="gray.700"
      p="2"
      my="1"
      maxW="sm"
      borderRadius="lg"
      overflow="hidden"
    >
      <Flex justify="space-between">
        <Box>
          {value.author && (
            <Flex mb="2" align="flex-end">
              <Img
                maxH="20px"
                borderRadius="full"
                mr="2"
                src={value.author.iconUrl}
              />
              <Text
                fontSize="xs"
                dangerouslySetInnerHTML={{ __html: value.author.value }}
              />
            </Flex>
          )}
          {value.title && (
            <Text
              fontSize="sm"
              mb="1"
              dangerouslySetInnerHTML={{ __html: value.title }}
            />
          )}
          {value.description && (
            <Text
              fontSize="xs"
              dangerouslySetInnerHTML={{ __html: value.description }}
            />
          )}
        </Box>
        {value.imageUrl && (
          <ModalledImg src={value.imageUrl} maxW="100px" borderRadius="lg" />
        )}
      </Flex>
      {value.thumbnailUrl && (
        <ModalledImg src={value.thumbnailUrl} maxH="200px" borderRadius="lg" />
      )}
      {value.footer && (
        <Text
          fontSize="xs"
          mt="1"
          color="gray.400"
          dangerouslySetInnerHTML={{ __html: value.footer }}
        />
      )}
    </Box>
  );
};
