import React, { createContext, useEffect, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [customer, setCustomer] = useState(null);
  const navigate = useNavigate();
  const location = useLocation();

  /**
   * 서버 응답/세션에 들어있는 다양한 형태를
   * 프론트가 쓰기 쉬운 "통일된 스키마"로 변환한다.
   * - { success, data: {...} } 도 OK
   * - { ... } (순수 데이터) 도 OK
   * - firstName/lastName ↔ first_name/last_name 양쪽 다 지원
   */
  const normalizeCustomer = (payload) => {
    if (!payload) return null;

    // 1) { success, data } 형태면 data를 꺼내고, 아니면 그대로 사용
    const data = payload?.data ?? payload;

    // 2) 최소 필드 유효성 (아무 것도 없으면 무시)
    if (typeof data !== 'object') return null;

    // 3) 키 통일(camel/snake 동시 지원) + 하위호환 필드 유지
    const first_name = data.first_name ?? data.firstName ?? data.name ?? '';
    const last_name = data.last_name ?? data.lastName ?? '';
    const phone_number = data.phone_number ?? data.phoneNumber ?? '';
    const normalized = {
      ...data,
      first_name,
      last_name,
      phone_number,
      // 하위 호환: 기존 코드가 참조할 수 있는 키도 채워준다
      name: first_name || data.name || '',
      firstName: first_name,
      lastName: last_name,
      full_name:
        data.full_name || [first_name, last_name].filter(Boolean).join(' '),
      coupons: Array.isArray(data.coupons) ? data.coupons : [],
    };

    // 4) 진짜 사용자 데이터인지 최소 보증 (전화번호/페이지ID 등)
    if (!normalized.phone_number && !normalized.pageId) {
      return null;
    }
    return normalized;
  };

  // 세션 복원
  useEffect(() => {
    try {
      const stored = sessionStorage.getItem('customer');
      if (stored) {
        const parsed = JSON.parse(stored);
        const normalized = normalizeCustomer(parsed);
        if (normalized) {
          setCustomer(normalized);
          if (location.pathname === '/') navigate('/home');
        } else {
          sessionStorage.removeItem('customer');
          setCustomer(null);
        }
      }
    } catch {
      sessionStorage.removeItem('customer');
      setCustomer(null);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [navigate, location.pathname]);

  // 로그인(세션 저장 포함)
  const login = (incoming) => {
    const normalized = normalizeCustomer(incoming);
    if (normalized) {
      setCustomer(normalized);
      sessionStorage.setItem('customer', JSON.stringify(normalized));
    } else {
      console.error('Login data is not in the expected format:', incoming);
      setCustomer(null);
      sessionStorage.removeItem('customer');
    }
  };

  // 로그아웃
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
