import React, { useState, useEffect } from "react";
import Select from "react-select";
import Cookies from "js-cookie";
import CryptoJS from "crypto-js";

const SECRET_KEY = process.env.REACT_APP_SECRET_KEY;

export default function MinutesDropdown({handleChange}) {
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

  const api = process.env.REACT_APP_API;
  const token = decrypt(Cookies.get("token"));
  const [minutes, setMinutes] = useState([]);


  useEffect(() => {
    const fetchMinutes = async () => {
      try {
        const res = await fetch(api + "/spoc", {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
          },
        });
        if (res.ok) {
          const data = await res.json()
          setMinutes(data)
        } else {
          console.log("Failed to fetch minutes:", res.status);
        }
      } catch (error) {
        console.log("Error fetching minutes:", error.message);
      }
    };

    fetchMinutes();
  }, [api, token]); // Ensure the effect runs when api or token changes

  return (
    <div style={{marginTop: "10px"}}>
      <Select
        placeholder = 'Select Handler'
        options={minutes.map((minutes) => ({
          value: minutes.fullname,
          label: minutes.fullname,
        }))}
        onChange={handleChange}
        isClearable
      />
    </div>
  );
}
