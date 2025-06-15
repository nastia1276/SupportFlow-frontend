// src/components/common/footer/Footer.jsx

import React from "react";
import { Box, Text, Flex, Link } from "@chakra-ui/react";

const Footer = () => {
  return (
    <Box as="footer" bg="green.700" py={8} minH="80px" color="white">
      <Flex direction="column" align="center" maxW="1200px" mx="auto">
        <Text fontSize="lg">
          &copy; {new Date().getFullYear()} Волонтерська платформа SupportFlow.
          Всі права захищені.
        </Text>
      </Flex>
    </Box>
  );
};

export default Footer;
