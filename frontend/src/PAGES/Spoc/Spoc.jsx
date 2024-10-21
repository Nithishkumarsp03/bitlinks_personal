import React, { useEffect, useState } from "react";
import {
  CircularProgressbarWithChildren,
  buildStyles,
} from "react-circular-progressbar";
import ChangingProgressProvider from "../Flows/MainFlow/ChangingProgressProvider";
import MainFlow from "../Flows/MainFlow/Flows";

// export default function Spoc({ handleViewConnectionSpoc,cancelflows }) {
  export default function Spoc({ handleViewConnectionSpoc, cancelflows }) {
    const [view, setview] = useState(false);
    const [viewconnection, setviewconnection] = useState(false);
  
    // Log the value of cancelflows to check if it's coming through
    console.log("cancelflows prop in Spoc component:", cancelflows);
  
    useEffect(() => {
      console.log("useEffect triggered: cancelflows =", cancelflows);
      if (cancelflows==true) {
        console.log("Cancelflows is true, resetting view and viewconnection");
        setview(false);
        setviewconnection(false);
      }
    }, [cancelflows]);
  
    const handleViewConnection = () => {  
      setviewconnection(true);
      handleViewConnectionSpoc();
    };
  

  return (
    <div
      style={{
        width: "100%",
        overflow: "hidden",
        marginLeft: "-10px",
      }}>
      <div className="search">
        <p style={{ fontSize: "16px", fontWeight: "600" }}>SPOC Networks</p>
        <hr className="hr-bar" />
        <div style={{ display: "flex" }}>
          <input
            type="text"
            // onChange={(e) => setSearchtermnetworks(e.target.value)}
            placeholder="Search SPOC Networks"
            className="search-bar"
          />
        </div>
      </div>
      <div className="networks-card">
        <div>
          <div>
            <div className={`card ${view || viewconnection ? "show" : ""}`}>
              {/* handlecanceltable */}
              {/* <div className="add-contact">
            <i
                      class="fa-solid fa-plus"
                      style={{  
                        color: "white",
                        fontSize: "12px",
                      }}></i>
            </div> */}
              <div style={{ display: "flex" }}>
                <div className="profile-container">
                  <ChangingProgressProvider
                  // value={connection.overall_completion}
                  >
                    {(value) => (
                      <div style={{ width: "80px" }}>
                        <CircularProgressbarWithChildren
                          className="custom-progressbar"
                          value={
                            // connection.overall_completion
                            100
                          }
                          circleRatio={0.75}
                          styles={buildStyles({
                            pathTransitionDuration: 10.5,
                            pathTransition: "#122E50",
                            strokeWidth: 23,
                            // thickness: "1",
                            rotation: 1 / 2 + 1 / 8,
                            // strokeLinecap: "butt",
                            width: "50vw",
                            trailColor: "#D7DADB",
                            pathColor:
                              // getPathColor(connection.overall_completion),
                              value > 0 ? "#2867B2" : "transparent",
                          })}>
                          {/* <p>dewf</p> */}
                        </CircularProgressbarWithChildren>
                      </div>
                    )}
                  </ChangingProgressProvider>
                </div>
                <div
                  style={{
                    marginRight: "0px",
                    marginTop: "35px",
                    marginLeft: "10px",
                    width: "9vw",
                  }}>
                  <p className="card-name">
                    {/* {connection.fullname} */}
                    THAYANITHI S
                  </p>
                  <p className="role">
                    {/* {connection.role} */}
                    MANAGER
                  </p>
                  {/* {!view ? ( */}
                  <p
                    onClick={(e) => {
                      //   e.stopPropagation();
                      handleViewConnection();
                      // connection.person_id
                    }}
                    style={{
                      color: "#0352b3",
                      fontSize: "12px",
                      marginTop: "2%",
                      fontWeight: "500",
                      cursor: "pointer",
                      height: "auto",
                      width: "10vw",
                    }}>
                    View Details
                  </p>
                  {/* ) : ( */}
                  {/* "" */}
                  {/* )} */}
                </div>
              </div>
              <div
                style={{ display: "flex" }}
                className={`card-details ${
                  view || viewconnection ? "show" : ""
                }`}>
                <hr
                  className={`custom-hr ${
                    view || viewconnection ? "show" : ""
                  }`}
                  color="#2867B2"
                />
                <p
                  className={`person-description ${
                    view || viewconnection ? "show" : ""
                  }`}>
                  {/* {connection.shortdescription} */}
                  DEVELOPER
                </p>
                <div
                  style={{
                    marginLeft: "20px",
                    // marginTop: "5%",
                  }}>
                  {/* {connection.linkedinurl ? ( */}
                  <div
                    className={`card-linkedin${
                      view || viewconnection ? "showlink" : ""
                    }`}
                    onClick={() =>
                      window.open(
                        // `https://${connection.linkedinurl}`,
                        "_blank",
                        "noopener noreferrer"
                      )
                    }
                    style={{
                      cursor: "pointer",
                      // marginTop: "10%",
                    }}>
                    <i className="fa-brands fa-linkedin"></i>
                    <span
                      style={{
                        textDecoration: "none",
                        color: "black",
                      }}>
                      LinkedIn
                    </span>
                    <img
                      // src={Networks}
                      alt=""
                      style={{
                        width: "9px",
                        height: "9px",
                      }}
                    />
                  </div>
                  {/* // ) : ( */}
                  {/* //   "" */}
                  {/* // )} */}
                  <div
                    className="card-number"
                    // {`card-number ${
                    // view || viewconnection
                    //   ? connection.linkedinurl
                    //     ? "showlink"
                    //     : "show"
                    //   : connection.linkedinurl
                    //     ? "link"
                    //   : connection.email
                    //     ? "none"
                    //     : "noneemail"
                    // }`}
                    // style={
                    //   connection.linkedinurl
                    //     ? {

                    //       }
                    //     : { marginTop: "15%" }
                    // }
                  >
                    <i className="fa-solid fa-phone"></i>
                    <p>
                      {/* {connection.phonenumber} */}
                      90563524634
                    </p>
                  </div>
                  <div className="card-mail">
                    {/* {connection.email?( */}
                    <div style={{ display: "flex", gap: "5px" }}>
                      <i className="fa-solid fa-envelope"></i>
                      <p>
                        {/* {connection.email} */}
                        thayanithi.cs23@bitsathy.ac.in
                      </p>
                    </div>
                    {/* ):('')} */}
                  </div>
                  {view || viewconnection ? (
                    <div className="subname-active" style={{ width: "100%" }}>
                      <div>
                        <p
                          style={{
                            width: "10vw",
                            display: "flex",
                            marginTop: "6%",
                            width: "100%",
                          }}>
                          {/* {connection.sub_name !== connection.fullname?(
                                  <p
                                  style={{
                                    fontSize: "14px",
                                    fontWeight: "600",
                                    width: "60%"
                                  }}>
                                  Referred by :
                                </p>
                                ):('')} */}
                          <p
                            style={{
                              marginLeft: "3%",
                              marginTop: "1%",
                              fontSize: "13px",
                              width: "100%",
                            }}>
                            {/* {connection.sub_name!==connection.fullname?(connection.sub_name):('')} */}
                          </p>
                        </p>
                      </div>
                      {/* <div className="card-active">
                            <button
                              className="activebutton"
                              onClick={(e) => {
                                e.stopPropagation();
                                handlemarkactive(
                                  connection.person_id,
                                  connection.status
                                );
                              }}>
                              {connection.status === 1
                                ? "Mark as Inactive"
                                : connection.status === 0
                                ? "Mark as Active"
                                : "Request sent"}
                            </button>
                          </div> */}
                    </div>
                  ) : (
                    ""
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
