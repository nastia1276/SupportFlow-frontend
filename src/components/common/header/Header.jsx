// src/components/common/header/Header.jsx

import React from "react";
import { Box, Flex, Heading, Image, Link, IconButton } from "@chakra-ui/react";
import { FaTelegramPlane } from "react-icons/fa";
import logo from "../../../assets/logo.png";
import { Link as RouterLink } from "react-router-dom";

const TELEGRAM_BOT_URL = "https://t.me/ForSupportFlow_bot";

const Header = () => {
  return (
    <Box
      as="header"
      bg="green.700"
      py={8}
      px={8}
      minH="80px"
      color="white"
      boxShadow="md"
    >
      <Flex align="center" justify="space-between" maxW="1200px" mx="auto">
        <RouterLink to="/home">
          <Image src={logo} alt="Логотип" height="100px" mr={4} />
        </RouterLink>

        <Heading size="lg" textAlign="center" flex="1">
          SupportFlow - координація волонтерської допомоги
        </Heading>

        <Link
          href={TELEGRAM_BOT_URL}
          isExternal
          ml={4}
          title="Telegram-бот"
          _hover={{ textDecoration: "none" }}
        >
          Telegram
          <IconButton
            icon={<FaTelegramPlane size={45} />}
            colorScheme="telegram"
            aria-label="Telegram-бот"
            size="lg"
            variant="ghost"
          />
        </Link>
      </Flex>
    </Box>
  );
};

export default Header;
