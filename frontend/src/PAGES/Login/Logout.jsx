import React from 'react';
import { useNavigate } from 'react-router-dom';

function Logout() {
  const navigate = useNavigate();

  const handleLogout = () => {
    // Clear the authentication status from localStorage
    localStorage.removeItem("isAuthenticated");

    // Redirect to the login page
    navigate('/');
  };

  return (
    <button onClick={handleLogout}>Logout</button>
  );
}

export default Logout;
