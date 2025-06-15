// src/pages/ProfilePage.jsx

import React, { useEffect, useState } from "react";
import {
  Box,
  Heading,
  FormControl,
  FormLabel,
  Input,
  Button,
  useToast,
  Spinner,
  Flex,
  VStack,
  Divider,
  Text,
} from "@chakra-ui/react";
import { useNavigate, Link } from "react-router-dom";
import axios from "axios";
import { useAuth } from "../contexts/AuthContext.jsx";
import Header from "../components/common/header/Header.jsx";
import Footer from "../components/common/footer/Footer.jsx";

const ProfilePage = () => {
  const { authState, setAuthState } = useAuth();
  const navigate = useNavigate();
  const [formData, setFormData] = useState({ name: "", email: "" });
  const [loading, setLoading] = useState(true);
  const toast = useToast();

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const res = await axios.get(
          "http://localhost:8000/api/v1/auth/profile",
          {
            headers: { Authorization: `Bearer ${authState.token}` },
          }
        );
        setFormData({
          name: res.data.user.name,
          email: res.data.user.email,
        });
        setLoading(false);
      } catch (err) {
        console.error("Profile fetch error", err);
        setLoading(false);
      }
    };
    fetchProfile();
  }, [authState.token]);

  const handleChange = (e) => {
    setFormData((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleUpdate = async () => {
    try {
      const res = await axios.put(
        "http://localhost:8000/api/v1/auth/profile",
        formData,
        {
          headers: { Authorization: `Bearer ${authState.token}` },
        }
      );

      setAuthState((prev) => ({
        ...prev,
        user: { ...prev.user, name: formData.name, email: formData.email },
      }));

      toast({
        title: "Профіль оновлено",
        status: "success",
        duration: 2000,
        isClosable: true,
      });
    } catch (err) {
      toast({
        title: "Помилка",
        description: err?.response?.data?.message || "Не вдалося оновити",
        status: "error",
        duration: 3000,
        isClosable: true,
      });
    }
  };

  if (loading) {
    return (
      <Flex justify="center" align="center" minH="100vh">
        <Spinner size="xl" />
      </Flex>
    );
  }

  return (
    <Flex direction="column" minH="100vh" bg="gray.50">
      <Header />

      <Flex flex="1">
        <Box
          w={{ base: "100%", md: "250px" }}
          p={6}
          bg="white"
          borderRight="1px solid #e2e8f0"
          minH="calc(100vh - 120px)"
        >
          <VStack spacing={5} align="stretch">
            <Heading size="md" color="green.700" textAlign="center">
              Меню
            </Heading>
            <Divider />
            <Text fontWeight="medium" color="gray.700" textAlign="center">
              {authState.user?.name || "Користувач"}
            </Text>

            <Button as={Link} to="/home" colorScheme="black" variant="outline">
              Всі замовлення
            </Button>
            <Button
              as={Link}
              to="/my-requests"
              colorScheme="black"
              variant="outline"
            >
              Мої замовлення
            </Button>
            <Button as={Link} to="/logout" colorScheme="red" variant="outline">
              Вийти
            </Button>
          </VStack>
        </Box>

        <Box flex="1" p={6}>
          <Button
            as={Link}
            to="/home"
            size="sm"
            variant="outline"
            mb={4}
            leftIcon={<span>←</span>}
          >
            Назад
          </Button>

          <Heading size="lg" mb={6}>
            Мій профіль
          </Heading>

          <FormControl mb={4}>
            <FormLabel>Ім’я</FormLabel>
            <Input name="name" value={formData.name} onChange={handleChange} />
          </FormControl>

          <FormControl mb={6}>
            <FormLabel>Email</FormLabel>
            <Input
              name="email"
              type="email"
              value={formData.email}
              onChange={handleChange}
            />
          </FormControl>

          <Button colorScheme="green" onClick={handleUpdate}>
            Зберегти зміни
          </Button>
        </Box>
      </Flex>

      <Footer />
    </Flex>
  );
};

export default ProfilePage;
