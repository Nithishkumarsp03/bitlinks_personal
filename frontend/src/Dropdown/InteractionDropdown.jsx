import React, { useState, useEffect } from "react";
import Select from "react-select";
import Cookies from "js-cookie";
import CryptoJS from "crypto-js";

const SECRET_KEY = process.env.REACT_APP_SECRET_KEY;

export default function InteractionDropdown({
  purpose,
  setPurpose,
  handleChange,
}) {
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
  const [interactions, setInteractions] = useState([]);

  useEffect(() => {
    const fetchInteractions = async () => {
      try {
        const res = await fetch(api + "/interactions", {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
        });
        if (res.ok) {
          const data = await res.json();
          setInteractions(data);
        } else {
          console.log("Failed to fetch interactions:", res.status);
        }
      } catch (error) {
        console.log("Error fetching interactions:", error.message);
      }
    };

    fetchInteractions();
  }, [api, token]); // Ensure the effect runs when api or token changes

  return (
    <div>
      <Select
        placeholder = 'Select type of Conversation'
        options={interactions.map((interaction) => ({
          value: interaction.interaction,
          label: interaction.interaction,
        }))}
        onChange={handleChange}
        isClearable
      />
    </div>
  );
}
