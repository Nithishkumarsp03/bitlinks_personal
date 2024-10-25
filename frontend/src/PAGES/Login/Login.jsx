import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import Cookies from "js-cookie";
import LoginCover from "../../Assets/Login_bg_11zon.png";
import Bitlinks from "../../Assets/bitlinks-bg.png";
import { Checkbox } from "@mui/material";
import Input from "@mui/joy/Input";
import "./Login.css";
import { useGoogleLogin } from '@react-oauth/google';
import axios from "axios";
import PreLoader from "../../COMPONENTS/PreLoader";
import CryptoJS from "crypto-js";

const SECRET_KEY = process.env.REACT_APP_SECRET_KEY;

export default function Login({ onLogin }) {

  const encrypt = (text) => {
    if (text) {
      return CryptoJS.AES.encrypt(text, SECRET_KEY).toString();
    }
    return '';
  };

  const decrypt = (ciphertext) => {
    try {
      if (ciphertext) {
        const bytes = CryptoJS.AES.decrypt(ciphertext, SECRET_KEY);
        return bytes.toString(CryptoJS.enc.Utf8);
      }
      return "";
    } catch (error) {
      console.error("Decryption error:", error.message);
      return "";
    }
  };

  const [email, setEmail] = useState('');
  const [name, setName] = useState('');
  const token = decrypt(Cookies.get("token"));
  const role = decrypt(Cookies.get("role"));
  const navigate = useNavigate();
  const [error, setError] = useState("");
  const [showErrorPopup, setShowErrorPopup] = useState(false);
  const [isLoading, setIsLoading] = useState(false); // State for preloader
  const [rights, setRights] = useState("");

  // useEffect(()=>{
  //   if(token && role === 'admin'){
  //     navigate('/bitcontacts/dashboard/admin');
  //   }
  //   else if(token && role === 'user'){
  //     navigate('/bitcontacts/dashboard');
  //   }
  // })

  useEffect(()=>{
    if(email && role === 'admin'){
      navigate('/dashboard/admin');
    }
    else if(email && role === 'user'){
      navigate('/dashboard');
    }
  })

  const login = () => {
    window.location.href = `${process.env.REACT_APP_API}/google`;
  }

  const credentialLogin = async() =>{
    try{
      const res = await fetch(`${process.env.REACT_APP_API}/login`,{
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ email, name }),
      });

      const data = await res.json();
      setRights(data.role);
      if (data.message === "Login successful"){
        Cookies.set("name", encrypt(name));
        Cookies.set("role", encrypt(data.role));
        Cookies.set("email", encrypt(email));
        // Cookies.set("picture", encrypt(PROFILE_PICTURE));
        if( data.role === 'admin'){
          navigate('/dashboard/admin');
        }
        else if( data.role === 'user'){
          navigate('/dashboard');
        }
        setEmail("");
        setName("");
      }
      else{
        setError(data.message);
        setShowErrorPopup(true);
      }
    }
    catch(error){
      console.log(error);
    }
  }

  useEffect(() => {
    // console.log("showErrorPopup changed:", showErrorPopup);
    if (showErrorPopup) {
      const timer = setTimeout(() => {
        setShowErrorPopup(false);
        // console.log("Error popup closed after 10 seconds");
      }, 10000); // 10 seconds

      return () => {
        clearTimeout(timer);
        // console.log("Cleanup: Timer cleared");
      };
    }
  }, [showErrorPopup]);

  const handleClosePopup = () => {
    setShowErrorPopup(false);
  };

  return (
    <div className="gsignin">
      {isLoading ? ( // Show preloader if loading
        <div style={{ 
          display: 'flex', 
          justifyContent: 'center', 
          alignItems: 'center', 
          height: '100vh',
          width: '100vw'
        }}>
          <PreLoader />
        </div>
      ) : (
        <>
          {showErrorPopup && (
            <div className="error-popup">
              <span>{error}</span>
              <button className="close-popup" onClick={handleClosePopup}>
                &times;
              </button>
            </div>
          )}
          <div className="Login-left">
            <div className="login-images">
              <img src={LoginCover} alt="Login_bg" className="login-bg" />
            </div>
          </div>
          <div className="Login_right">
            <div className="Right-container">
              <div className="login-bitlinks">
                <img
                  src={Bitlinks}
                  alt="Bitlinks_img"
                  style={{ width: "30%" }}
                />
              </div>
              <h3 style={{ fontSize: "200%", fontFamily: "Open Sans", marginTop: "2%" }}>
                Login to your Account
              </h3>
              <p style={{ fontSize: "120%", fontFamily: "Open Sans", marginTop: "1%", color: "grey", fontStyle: "italic" }}>
                See what is going on with your business
              </p>
              <div style={{ marginLeft: "12%", marginTop: "3%" }}>
                <button className="g-signin" onClick={() => login()}>
                  Sign in with Google
                </button>
              </div>
              <p className="or-sign" style={{ marginLeft: "12%", marginTop: "1%", color: "grey", fontStyle: "italic" }}>
                Or sign in with your email
              </p>
              <div style={{ marginTop: "3%", width: "25vw" }}>
                <div className="index_text">Email</div>
                <Input
                  style={{ marginTop: "2%" }}
                  type="email"
                  className="login_input"
                  placeholder="mail@abc.com"
                  name="fullname"
                  onChange={(e)=>setEmail(e.target.value)}
                  value={email}
                />
                <div className="index_text" style={{ marginTop: "5%" }}>Password</div>
                <Input
                  style={{ marginTop: "2%" }}
                  type="password"
                  className="login_input"
                  placeholder=".........."
                  onChange={(e)=>setName(e.target.value)}
                  value={name}
                />
                <div className="below-password">
                  <div className="checkbox">
                    <Checkbox />
                  </div>
                  <div style={{ marginTop: "3%", display: "flex", width: "100%" }}>
                    <p style={{ color: "grey", width: "100%", fontWeight: "500" }}>Remember me</p>
                    <h4 style={{ marginLeft: "30%", color: "#245C9F", width: "100%", fontWeight: "500" }}>
                      Forgot Password?
                    </h4>
                  </div>
                </div>
                <button className="login_button" onClick={credentialLogin}>Click to Login</button>
                <div className="account_bottom">
                  <p style={{ color: "grey", width: "80%", fontSize: "80%", fontWeight: "500", marginLeft: "20%" }}>
                    Not Registered yet?
                  </p>
                  <p style={{ color: "#245C9F", width: "100%", fontSize: "80%", fontWeight: "500" }}>
                    Create an Account
                  </p>
                </div>
              </div>
            </div>
          </div>
        </>
      )}
    </div>
  );
}
