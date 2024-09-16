import React, { useEffect } from "react";
import { useSearchParams, useNavigate } from "react-router-dom";
import Cookies from "js-cookie";
import CryptoJS from 'crypto-js';
import BeatLoader from './BeatLoader';

const Welcome = () => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const SECRET_KEY = 'your-secret-key';
  const loading = true;

  const encrypt = (text) => {
    if (text) {
      return CryptoJS.AES.encrypt(text, SECRET_KEY).toString();
    }
    return '';
  };

  const decrypt = (ciphertext) => {
    if (ciphertext) {
      try {
        const bytes = CryptoJS.AES.decrypt(ciphertext, SECRET_KEY);
        return bytes.toString(CryptoJS.enc.Utf8);
      } catch (error) {
        console.error("Decryption error:", error);
        return '';
      }
    }
    return '';
  };

  useEffect(() => {
    const dataParam = searchParams.get("data");

    if (dataParam) {
      try {
        const data = JSON.parse(decodeURIComponent(dataParam));
        const { token, NAME, ROLE, ID, EMAIL, PROFILE_PICTURE } = data;

        // console.log("Data fields:", { token, NAME, ROLE, ID, EMAIL, PROFILE_PICTURE });

        // Set cookies with encrypted values
        Cookies.set("token", encrypt(token), { expires: 1 });
        Cookies.set("name", encrypt(NAME));
        Cookies.set("role", encrypt(ROLE));
        Cookies.set("email", encrypt(EMAIL));
        Cookies.set("picture", encrypt(PROFILE_PICTURE));

        // Retrieve and decrypt cookies
        const savedData = {
          token: Cookies.get("token"),
          name: decrypt(Cookies.get("name")),
          email: decrypt(Cookies.get("email")),
          role: decrypt(Cookies.get("role")),
          picture: decrypt(Cookies.get("picture"))
        };

        // console.log("Saved JSON data:", savedData);
        if(!savedData.email){
          navigate("/bitcontacts");
        }

        if (savedData.role === 'admin') {
          navigate("/bitcontacts/dashboard/admin");
        } else {
          navigate('/bitcontacts/dashboard');
        }
      } catch (error) {
        console.error("Error processing data:", error);
      }
    }
  }, [searchParams, navigate]);

  return (
    <div style={{ display: 'flex', justifyContent: 'center', height: '100%', width: '100%' }}>
      <div style={{marginTop: '20%'}}>
          <BeatLoader loading={loading} color="#2867B2" size={20} />
      </div>
    </div>
  );
};

export default Welcome;
