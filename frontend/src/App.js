import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { GoogleOAuthProvider } from '@react-oauth/google';
import Home from './PAGES/Home/Home';
import Login from './PAGES/Login/Login';
import { PersonProvider } from './COMPONENTS/Context';
import ErrorPage from "./PAGES/Login/Login_error";
import Settings from './PAGES/Settings/Settings';
import User from './PAGES/Home/User';
import Welcome from './COMPONENTS/Welcome';
import Cookies from "js-cookie";
import { decrypt } from './COMPONENTS/cookieUtils';

export default function App() {
  const clientId = process.env.REACT_APP_CLIENT_ID;
  const userRole = decrypt(Cookies.get('role'));

  // Define which roles can access the admin and user routes
  const isAdmin = userRole === 'admin'; // Example logic for admin access
  const isUser = userRole === 'user'; // Example logic for user access

  return (
    <GoogleOAuthProvider clientId={clientId}>
      <Router>
        <Routes>
          <Route path="*" element={<ErrorPage />} />
          <Route path="/bitcontacts" element={<Login />} />
          <Route path="/bitcontacts/settings" element={<Settings />} />
          <Route path="/bitcontacts/welcome" element={<Welcome />} />
          <Route path="/404" element={<ErrorPage />} /> {/* Define a 404 route */}
          
          <Route 
            path="/bitcontacts/dashboard/admin" 
            element={isAdmin ? <PersonProvider><Home /></PersonProvider> : <Navigate to="/404" />} 
          />
          <Route 
            path="/bitcontacts/dashboard" 
            element={isUser ? <PersonProvider><User /></PersonProvider> : <Navigate to="/404" />} 
          />
        </Routes>
      </Router>
    </GoogleOAuthProvider>
  );
}
