import { createContext, useContext, useEffect, useState } from "react";
import API from "../services/api";

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(
    JSON.parse(localStorage.getItem("user"))
  );
  const [loading, setLoading ]= useState(true);
//   Load User from LocalStorage
useEffect(()=>{
    const storedUser = localStorage.getItem("user");
    if(storedUser){
    setUser(JSON.parse(storedUser));
    }
    setLoading(false);
},[]);
// Login
  const login = async (email, password) => {
    try {
      const response = await API.post("/auth/login",{ email, password });
      const data = response.data;

      localStorage.setItem( "token",data.token);
      localStorage.setItem("user",JSON.stringify(data.admin));
      setUser(data.admin);
      return true;
    } catch (error) {
      console.log(error);
      return false;
    }
  };
  const logout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    setUser(null);
  };
  
  return (
    <AuthContext.Provider
      value={{
        user,
        login,
        logout
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () =>
  useContext(AuthContext);