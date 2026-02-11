import React, { createContext, useState, useContext } from "react";

// Создаем контекст
const AuthContext = createContext();

// Провайдер для обертки приложения
export const AuthProvider = ({ children }) => {
  const [isLoginFormOpen, setIsLoginFormOpen] = useState(false);
  const [location, setLocation] = useState(null);
  const [user, setUser] = useState(null);
  const openLoginForm = (location) => {
    console.log(location);
    setLocation(location);
    setIsLoginFormOpen(true);
  };
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

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};
