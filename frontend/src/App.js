import React from "react";
import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
} from "react-router-dom";
import { GoogleOAuthProvider } from "@react-oauth/google";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import Home from "./PAGES/Home/Home";
import Login from "./PAGES/Login/Login";
import { PersonProvider } from "./COMPONENTS/Context";
import ErrorPage from "./PAGES/Login/Login_error";
import Settings from "./PAGES/Settings/Settings";
import User from "./PAGES/Home/User";
import Welcome from "./COMPONENTS/Welcome";
import Cookies from "js-cookie";
import { decrypt } from "./COMPONENTS/cookieUtils";
import MinutesDropdown from "./Dropdown/MinutesDropdown";

function Protected({ children }) {
  const navigate = useNavigate();
  const [isAuth, setAuth] = useState(false);
  const [role, setRole] = useState(null);

  useEffect(() => {
    const checkAuth = async () => {
      const decryptedRole = decrypt(Cookies.get("role"));
      console.log('Decrypted Role:', decryptedRole);
      if (decryptedRole) {
        setAuth(true);
        setRole(decryptedRole);
      } else {
        navigate("/bitcontacts");
      }
    };

    checkAuth();
  }, [navigate]);

  if (!isAuth) {
    return null; // or a loading spinner
  }

  if (role === "admin") {
    return children; // Render children if role is admin
  } else if (role === "user") {
    return children; // Render children if role is user
  } else {
    navigate("/404");
    return null;
  }
}


export default function App() {
  const clientId = process.env.REACT_APP_CLIENT_ID;
  const role = decrypt(Cookies.get("role"));

  return (
    <GoogleOAuthProvider clientId={clientId}>
      <Router>
        <Routes>
          <Route path="*" element={<ErrorPage />} />
          <Route path="/bitcontacts" element={<Login />} />
          <Route path="/bitcontacts/settings" element={<Settings />} />
          <Route path="/bitcontacts/welcome" element={<Welcome />} />
          <Route path="/404" element={<ErrorPage />} />
          <Route path="/bitcontacts/switch" element={<MinutesDropdown />} />
          <Route
            path="/bitcontacts/dashboard/admin"
            element={
              <PersonProvider>
                <Home />
              </PersonProvider>
            }
          />
          <Route
            path="/bitcontacts/dashboard"
            element={
              <PersonProvider>
                <User />
              </PersonProvider>
            }
          />
        </Routes>
      </Router>
    </GoogleOAuthProvider>
  );
}


