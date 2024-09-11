import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { GoogleOAuthProvider } from '@react-oauth/google';
import Home from './PAGES/Home/Home';
import Login from './PAGES/Login/Login';
import { PersonProvider } from './COMPONENTS/Context';
import ErrorPage from "./PAGES/Login/Login_error";
// import Default from './PAGES/Default/Default';
import  Settings  from './PAGES/Settings/Settings'
import User from './PAGES/Home/User';
import Welcome from './COMPONENTS/Welcome';
// import MoonLoader from './COMPONENTS/MoonLoader';

export default function App() {

  const clientId = process.env.REACT_APP_CLIENT_ID

  return (
    <GoogleOAuthProvider clientId={clientId}>
      <Router>
        <Routes>
          <Route path="*" element={<ErrorPage/>} />
          <Route path="/bitcontacts" element={<Login />} />
          <Route path="/bitcontacts/settings" element={<Settings />} />
          <Route path="/bitcontacts/welcome" element={<Welcome />} />
          {/* <Route path="/loader" element={<MoonLoader color="#2867B2" size={30}/>} /> */}

          <Route path="/bitcontacts/dashboard/admin" element={
            <PersonProvider>
              <Home />
            </PersonProvider>
          } />
          <Route path="/bitcontacts/dashboard" element={
            <PersonProvider>
              <User />
            </PersonProvider>
          } />
        </Routes>
      </Router>
    </GoogleOAuthProvider>
  );
}
