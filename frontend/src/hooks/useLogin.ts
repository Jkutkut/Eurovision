import {useEffect, useState} from "react";

interface useLoginHook {
  user: string | null;
  login: (user: string) => void;
  logout: () => void;
}

const useLogin = () => {
  const USER_KEY = 'eurovision-login';
  const [ user, setUser ] = useState<string | null>(null);

  useEffect(() => {
    const login = localStorage.getItem(USER_KEY);
    if (login != null) {
      setUser(login);
    }
  }, []);

  const login = (user: string) => {
    localStorage.setItem(USER_KEY, user);
    setUser(user);
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem(USER_KEY);
  }

  return {
    user,
    login,
    logout
  } as useLoginHook;
};

export default useLogin;
