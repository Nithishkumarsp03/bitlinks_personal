import React, { useState, useEffect } from "react";
import "./Details.css";
import RankFlow from "../RankFlow/RankFlow/RankFlow";
import { usePerson } from "../../COMPONENTS/Context";
import Cookies from 'js-cookie';
import CryptoJS from 'crypto-js';

const SECRET_KEY = process.env.REACT_APP_SECRET_KEY;

export default function Details({ handlecancelviewconnections }) {
  const api = process.env.REACT_APP_API;
  const decrypt = (ciphertext) => {
    try {
        if (ciphertext) {
            const bytes = CryptoJS.AES.decrypt(ciphertext, SECRET_KEY);
            return bytes.toString(CryptoJS.enc.Utf8);
        }
        return '';
    } catch (error) {
        console.error("Decryption error:", error.message);
        return '';
    }
};

const token = decrypt(Cookies.get("token"));
  
  const [viewdetails, setviewdetails] = useState(true);
  const [viewconnections, setviewconnections] = useState(false);
  const [data, setData] = useState(null); // Initial state as null
  const { selectedPersonId } = usePerson();

  const handleviewdetails = () => {
    setviewdetails(true);
    setviewconnections(false);
  };

  const handleviewconnections = () => {
    setviewdetails(false);
    setviewconnections(true);
  };

  useEffect(() => {
    if (!selectedPersonId) return;

    const fetchSummary = async () => {
      try {
        const response = await fetch(api + "/summary", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            'Authorization': `Bearer ${token}`
          },
          body: JSON.stringify({ selectedPersonId }),
        });

        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }

        const result = await response.json();
        // console.log(result);

        if (typeof result === "object" && !Array.isArray(result)) {
          setData(result); // Directly set the object if it's not an array
        } else {
          console.error("Received data is not an object:", result);
        }
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    };

    fetchSummary();
  }, [selectedPersonId]);

  return (
    <div className="viewdetails">
      <div style={{ display: "flex" }}>
        <i
          className="fa-solid fa-arrow-left"
          alt="cancel-img"
          style={{ width: "3%", cursor: "pointer", padding: "2%" }}
          onClick={handlecancelviewconnections}
        />
        <div
          style={{
            display: "flex",
            padding: "1.5% 1% 1% 18%",
            gap: "5rem",
            width: "100%",
          }}
        >
          <button
            className={`viewbuttons ${viewdetails ? "edit" : ""}`}
            onClick={handleviewdetails}
          >
            VIEW DETAILS
          </button>
          <button
            className={`viewbuttons ${viewconnections ? "edit" : ""}`}
            onClick={handleviewconnections}
          >
            VIEW CONNECTIONS
          </button>
        </div>
      </div>
      <div className="viewconnection-bottom">
        {viewdetails ? (
          data ? (
            <div>
              <h3 style={{ textAlign: "center", marginTop: "10px" }}>
                Person Summary
              </h3>
              <table className="details-table">
                <tbody>
                  {Object.entries({
                    "NAME": data.fullname,
                    "Phonenumber": data.phonenumber,
                    "Age": data.age,
                    "Email": data.email,
                    "Linkedin URL": data.linkedinurl,
                    "Address": data.address,
                    "Purpose": data.purposes,
                    "Company Name": data.companyname,
                    "Position": data.position,
                    "Experience": data.experience,
                    "Role": data.role,
                    "Company Address": data.companyaddress,
                    "Domain": data.domain,
                    "Specialist Skills": data.specialistskills,
                    "Skillset": data.skillset,
                    "Hashtags": data.hashtags
                  }).map(([key, value], index) => (
                    <tr key={key} className={index % 2 === 0 ? "even-row" : ""}>
                      <td className="detail-key">{key}:</td>
                      <td className="detail-value">{value || "N/A"}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          ) : (
            <p>Loading...</p>
          )
        ) : (
          <RankFlow />
        )}
      </div>
    </div>
  );
}
