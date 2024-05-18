/* eslint-disable react/prop-types */
import { createContext, useEffect, useState } from "react";
import { getToken, setToken } from "../utils/storageUtils";
import axios from "axios";

export const AuthContext = createContext();

export const AuthProvider = (props) => {
  function cerrarSesion() {
    localStorage.removeItem("token");
    setCurrentToken(null);
  }

  function iniciarSesion(token) {
    setToken(token);
    setCurrentToken(token);
  }

  const [currentToken, setCurrentToken] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    (async () => {
      try {
        const token = getToken();
        if (token) {
          const resultado = await axios.post(
            import.meta.env.VITE_SERVER_URI + "/check-token",
            {
              token,
            }
          );
          if (resultado.data.code === 200) {
            setCurrentToken(token);
          } else {
            localStorage.removeItem("token");
          }
        }
      } catch (e) {
        console.log("ERROR CONNECTING TO THE SERVER");
        localStorage.removeItem("token");
      }
      setLoading(false);
    })();
  }, []);

  return (
    <AuthContext.Provider value={{ currentToken, cerrarSesion, iniciarSesion }}>
      {loading ? null : props.children}
    </AuthContext.Provider>
  );
};
