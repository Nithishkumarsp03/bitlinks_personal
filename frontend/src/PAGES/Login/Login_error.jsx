import React from "react";
import "./Login_error.css"; // Make sure this file is updated with the new styles

function ErrorPage() {
  const handleRetry = () => {
    window.location.reload();
  };

  return (
    <div className="error-page">
      <div className="animated-container">
        <h1 className="error-title">404</h1>
        <p className="error-message">Page Not Found</p>
      </div>
      <button className="retry-button" onClick={handleRetry}>Retry</button>
    </div>
  );
}

export default ErrorPage;
