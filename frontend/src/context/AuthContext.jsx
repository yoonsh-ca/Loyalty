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
    } catch (error) {
      sessionStorage.removeItem('customer');
      setCustomer(null);
    }
  }, [navigate, location]);

  const login = (customerData) => {
    if (customerData && customerData.data) {
      setCustomer(customerData.data);
      sessionStorage.setItem('customer', JSON.stringify(customerData.data));
    } else {
      console.error('Login data is not in the expected format: ', customerData);
      setCustomer(null);
      sessionStorage.removeItem('customer');
    }
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
