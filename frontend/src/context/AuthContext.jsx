import React, { createContext, useEffect, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [customer, setCustomer] = useState(null);
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    try {
      const storedCustomer = sessionStorage.getItem('customer');
      if (storedCustomer) {
        const parsedCustomer = JSON.parse(storedCustomer);
        setCustomer(parsedCustomer);

        if (location.pathname === '/') {
          navigate('/home');
        }
      }
    } catch (e) {
      sessionStorage.removeItem('customer');
      setCustomer(null);
    }
  }, [navigate]);

  const login = (customerData) => {
    setCustomer(customerData);
    sessionStorage.setItem('customer', JSON.stringify(customerData));
  };

  const logout = () => {
    setCustomer(null);
    sessionStorage.removeItem('customer');
    navigate('/');
  };

  return (
    <AuthContext.Provider value={{ customer, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};
