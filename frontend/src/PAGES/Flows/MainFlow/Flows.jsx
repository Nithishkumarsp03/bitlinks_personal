import React, { useState, useEffect } from "react";
import "./Flows.css";
import Flowchart from "../Flowchart/flowchart";
import History from "../History/History";
// import ApexChartDailyGraph from "../Graph/DailyGraph";
import ApexChartMonthlyGraph from "../Graph/MonthlyGraph";
import ApexChartfiveYearlyGraph from "../Graph/FiveyearGraph";
import ApexChartYearlyGraph from "../Graph/YearlyGraph";
import Minutes from "../Minutes/Minutes";
import { usePerson } from "../../../COMPONENTS/Context";
import Cancel from "../../../Assets/cancel.png";
import CryptoJS from 'crypto-js';
import Cookies from 'js-cookie';

const SECRET_KEY = 'your-secret-key';

export default function MainFlow({ subPersonId ,fetchPersonalInfo, fetchUserNetworks, handlecancelflows, fetchRescheduleData, fetchRescheduleDataNetworks}) {
  const [activeFlow, setActiveFlow] = useState("history"); // Default to "graph"
  const [activeGraph, setActiveGraph] = useState("monthly");
  const { selectedPersonId, setSelectedPersonId } = usePerson();
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

  // console.log(decrypt(Cookies.get("token")));

  useEffect(
    () => {
      if (subPersonId) {
        setSelectedPersonId(subPersonId);
        // console.log(subPersonId);
      } else {
        // console.log('Selected Person ID remains the same:', selectedPersonId);
      }

      // console.log("SubPerson ID in MainFlow:", selectedPersonId);
    },
    [selectedPersonId],
    [subPersonId]
  );

  const handleFlowClick = (flow) => {
    setActiveFlow(flow);
  };

  return (
    <div className="main-flow">
      <div>
        <div
          onClick={() => handleFlowClick("graph")}
          className={`flow-graph ${activeFlow === "graph" ? "expanded" : ""}`}>
          <p className={`flow-titles1 ${activeFlow === "graph" ? "expanded" : "" }`}>
            
            {activeFlow === "graph" && (<i
          class="fa-solid fa-arrow-left"
              alt="cancel-img"
              style={{ width: "3%", marginRight: "75%",cursor: "pointer" }}
              onClick={handlecancelflows}
            />)}
            Engagement Graph
          </p>
          {activeFlow === "graph" && (
            <div>
              <div className="graph-head-buttons">
                <div className="graph-buttons">
                  {/* <button
                    onClick={() => setActiveGraph("daily")}
                    className={`graph-button ${
                      activeGraph === "daily" ? "active" : ""
                    }`}
                  >
                    Daily
                  </button> */}
                  <button
                    onClick={() => setActiveGraph("monthly")}
                    className={`graph-button ${
                      activeGraph === "monthly" ? "active" : ""
                    }`}>
                    Monthly
                  </button>
                  <button
                    onClick={() => setActiveGraph("yearly")}
                    className={`graph-button ${
                      activeGraph === "yearly" ? "active" : ""
                    }`}>
                    Yearly
                  </button>
                  <button
                    onClick={() => setActiveGraph("fiveyear")}
                    className={`graph-button ${
                      activeGraph === "fiveyear" ? "active" : ""
                    }`}>
                    5 Years
                  </button>
                </div>
              </div>
              <div>
                {/* {activeGraph === "daily" && <ApexChartDailyGraph />} */}
                {activeGraph === "monthly" && <ApexChartMonthlyGraph />}
                {activeGraph === "yearly" && <ApexChartYearlyGraph />}
                {activeGraph === "fiveyear" && <ApexChartfiveYearlyGraph />}
              </div>
            </div>
          )}
        </div>
        {/* **************************** */}
        <div
          onClick={() => handleFlowClick("minutes")}
          className={`flow-history ${activeFlow === "minutes" ? "expanded" : ""}`}>
          <p className={`flow-titles1 ${activeFlow === "minutes" ? "expanded" : "" }`}>
            
            {activeFlow === "minutes" && (<i
          class="fa-solid fa-arrow-left"
              alt="cancel-img"
              style={{ width: "3%", marginRight: "75%",cursor: "pointer" }}
              onClick={handlecancelflows}
            />)}
            Minutes of Meeting
          </p>
          {activeFlow === "minutes" && (
            <div style={{display: "flex",justifyContent: "center",alignItems: "center"}}>
              <Minutes />
            </div>
          )}
        </div>
        {/* **************************** */}

        <div
          onClick={() => handleFlowClick("history")}
          className={`flow-history ${
            activeFlow === "history" ? "expanded" : ""
          }`}>
          <div
            className={`history-add ${
              activeFlow === "history" ? "expanded" : ""
            }`}>
            <p className="flow-titles">{activeFlow === "history" && (<i
          class="fa-solid fa-arrow-left"
              alt="cancel-img"
              style={{ width: "3%", marginRight: "83%",cursor: "pointer" }}
              onClick={handlecancelflows}
            />)}
            History
            </p>
            {/* <div className={`history-add-main ${activeFlow === "history" ? "expanded" : ""}`}> */}
          </div>
          {/* </div> */}
          {activeFlow === "history" && <History fetchPersonalInfo={fetchPersonalInfo} fetchUserNetworks={fetchUserNetworks} fetchRescheduleData={fetchRescheduleData} fetchRescheduleDataNetworks={fetchRescheduleDataNetworks}/>}
        </div>
        <div
          onClick={() => handleFlowClick("chart")}
          className={`flow-chart ${activeFlow === "chart" ? "expanded" : ""}`}>
          <div className="flow-chart-head">
            <p className="flow-titles">{activeFlow === "chart" && (<i
          class="fa-solid fa-arrow-left"
              alt="cancel-img"
              style={{ width: "3%", marginRight: "75%",cursor: "pointer" }}
              onClick={handlecancelflows}
            />)}Info Graphic Flow</p>
            {/* {activeFlow === "chart" && (
              <div className="buttonContainer-flowchart-head">
                <button color="primary" className="discard-flowchart-head">
                  Discard
                </button>
                <button color="primary" className="saved-flowchart-head">
                  Save changes
                </button>
              </div>
            )} */}
          </div>
          {activeFlow === "chart" && <Flowchart />}
        </div>
      </div>
    </div>
  );
}
