// src/pages/AuthPage.jsx

import React, { useState } from "react";
import {
  Box,
  Tabs,
  TabList,
  TabPanels,
  Tab,
  TabPanel,
  Heading,
  Input,
  FormControl,
  FormLabel,
  Button,
  Stack,
  Alert,
  AlertIcon,
  useToast,
  Center,
} from "@chakra-ui/react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../contexts/AuthContext.jsx";

const AuthPage = () => {
  const { setAuthState } = useAuth();
  const navigate = useNavigate();
  const toast = useToast();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loginError, setLoginError] = useState("");
  const [loginLoading, setLoginLoading] = useState(false);

  const [regName, setRegName] = useState("");
  const [regEmail, setRegEmail] = useState("");
  const [regPassword, setRegPassword] = useState("");
  const [regRole, setRegRole] = useState("");
  const [regError, setRegError] = useState("");
  const [regLoading, setRegLoading] = useState(false);

  const handleLogin = async (e) => {
    e.preventDefault();
    setLoginLoading(true);
    setLoginError("");

    try {
      const response = await axios.post(
        `${process.env.REACT_APP_API_URL}/api/v1/auth/login`,
        {
          email,
          password,
        }
      );

      const { token, user } = response.data;
      localStorage.setItem("authToken", token);
      setAuthState({ token, user });
      navigate("/home");
    } catch (err) {
      setLoginError("Невірна електронна пошта або пароль");
      setLoginLoading(false);
    }
  };

  const handleRegister = async (e) => {
    e.preventDefault();
    setRegLoading(true);
    setRegError("");

    if (!regName || !regEmail || !regPassword || !regRole) {
      setRegError("Ім’я, email, пароль та роль є обов’язковими полями");
      setRegLoading(false);
      return;
    }

    if (regRole !== "requester" && regRole !== "volunteer") {
      setRegError("Роль має бути 'requester' або 'volunteer'");
      setRegLoading(false);
      return;
    }

    try {
      const response = await axios.post(
        `${process.env.REACT_APP_API_URL}/api/v1/auth/register`,
        {
          name: regName,
          email: regEmail,
          password: regPassword,
          role: regRole,
        }
      );

      const { token, user } = response.data;
      localStorage.setItem("authToken", token);
      setAuthState({ token, user });

      toast({
        title: "Успішна реєстрація",
        description: "Ви були автоматично авторизовані",
        status: "success",
        duration: 3000,
        isClosable: true,
      });

      navigate("/home");
    } catch (err) {
      setRegError(err?.response?.data?.message || "Помилка реєстрації");
    } finally {
      setRegLoading(false);
    }
  };

  return (
    <Box
      maxW="lg"
      mx="auto"
      mt={10}
      p={6}
      boxShadow="lg"
      borderRadius="xl"
      bg="white"
    >
      <Tabs isFitted variant="enclosed-colored" colorScheme="green">
        <TabList mb="1em">
          <Tab>Вхід</Tab>
          <Tab>Реєстрація</Tab>
        </TabList>

        <TabPanels>
          <TabPanel>
            <Heading mb={6} fontSize="2xl" textAlign="center">
              Вхід до системи
            </Heading>
            {loginError && (
              <Alert status="error" mb={4}>
                <AlertIcon />
                {loginError}
              </Alert>
            )}
            <form onSubmit={handleLogin}>
              <Stack spacing={4}>
                <FormControl isRequired>
                  <FormLabel>Електронна пошта</FormLabel>
                  <Input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="example@email.com"
                  />
                </FormControl>

                <FormControl isRequired>
                  <FormLabel>Пароль</FormLabel>
                  <Input
                    type="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="********"
                  />
                </FormControl>

                <Button
                  type="submit"
                  bg="green.700"
                  color="white"
                  _hover={{ bg: "green.900" }}
                  isLoading={loginLoading}
                  loadingText="Авторизація"
                >
                  Увійти
                </Button>

                <Stack spacing={4} mt={6}>
                  <a
                    href={`${process.env.REACT_APP_API_URL}/auth/google?role=requester`}
                    style={{
                      display: "inline-block",
                      padding: "12px 20px",
                      background: "#1a73e8",
                      color: "white",
                      borderRadius: 4,
                      fontWeight: 600,
                      textAlign: "center",
                      textDecoration: "none",
                    }}
                  >
                    Увійти через Google як Замовник
                  </a>

                  <a
                    href={`${process.env.REACT_APP_API_URL}/auth/google?role=volunteer`}
                    style={{
                      display: "inline-block",
                      padding: "12px 20px",
                      background: "#1a73e8",
                      color: "white",
                      borderRadius: 4,
                      fontWeight: 600,
                      textAlign: "center",
                      textDecoration: "none",
                    }}
                  >
                    Увійти через Google як Волонтер
                  </a>
                </Stack>
              </Stack>
            </form>
          </TabPanel>

          <TabPanel>
            <Heading mb={6} fontSize="2xl" textAlign="center">
              Реєстрація
            </Heading>
            {regError && (
              <Alert status="error" mb={4}>
                <AlertIcon />
                {regError}
              </Alert>
            )}
            <form onSubmit={handleRegister}>
              <Stack spacing={4}>
                <FormControl isRequired>
                  <FormLabel>Ім’я</FormLabel>
                  <Input
                    value={regName}
                    onChange={(e) => setRegName(e.target.value)}
                    placeholder="Ваше ім’я"
                  />
                </FormControl>

                <FormControl isRequired>
                  <FormLabel>Електронна пошта</FormLabel>
                  <Input
                    value={regEmail}
                    type="email"
                    onChange={(e) => setRegEmail(e.target.value)}
                  />
                </FormControl>

                <FormControl isRequired>
                  <FormLabel>Пароль</FormLabel>
                  <Input
                    value={regPassword}
                    type="password"
                    onChange={(e) => setRegPassword(e.target.value)}
                  />
                </FormControl>

                <FormControl isRequired>
                  <FormLabel>Роль</FormLabel>
                  <select
                    value={regRole}
                    onChange={(e) => setRegRole(e.target.value)}
                    style={{
                      padding: "0.5rem",
                      borderRadius: "0.375rem",
                      border: "1px solid #E2E8F0",
                      fontSize: "1rem",
                      color: "#2D3748",
                    }}
                  >
                    <option value="">Оберіть роль</option>
                    <option value="requester">Отримувач допомоги</option>
                    <option value="volunteer">Волонтер</option>
                  </select>
                </FormControl>
                <Button
                  type="submit"
                  bg="green.700"
                  color="white"
                  _hover={{ bg: "green.900" }}
                  isLoading={regLoading}
                  loadingText="Реєстрація"
                >
                  Зареєструватися
                </Button>
              </Stack>
            </form>
          </TabPanel>
        </TabPanels>
      </Tabs>
    </Box>
  );
};

export default AuthPage;
