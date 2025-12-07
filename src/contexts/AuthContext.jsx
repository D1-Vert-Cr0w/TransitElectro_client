import React, { createContext, useState, useContext } from "react";

// Создаем контекст
const AuthContext = createContext();

// Провайдер для обертки приложения
export const AuthProvider = ({ children }) => {
  const [isLoginFormOpen, setIsLoginFormOpen] = useState(false);
  const [location, setLocation] = useState(null);
  const [user, setUser] = useState(null); // информация о пользователе

  // Функция для открытия формы входа
  const openLoginForm = (location) => {
    console.log(location);
    setLocation(location);
    setIsLoginFormOpen(true);
  };
  // Функция для закрытия формы входа
  const closeLoginForm = () => {
    setIsLoginFormOpen(false);
  };
  const value = {
    // Состояние
    location,
    isLoginFormOpen,
    user,

    // Функции
    openLoginForm,
    closeLoginForm,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

// Кастомный хук для использования контекста
export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};
