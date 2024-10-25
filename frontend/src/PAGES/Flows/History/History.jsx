import React, { useState, useEffect } from "react";
import axios from "axios";
import {
  Stepper,
  Step,
  StepLabel,
  StepContent,
  Typography,
  Dialog,
  Box,
} from "@mui/material";
import { DemoContainer } from "@mui/x-date-pickers/internals/demo";
import { LocalizationProvider, DateTimePicker, Unstable_PickersSectionListSectionSeparator } from "@mui/x-date-pickers";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import dayjs from 'dayjs';
import utc from 'dayjs/plugin/utc';
import timezone from 'dayjs/plugin/timezone';
import Textarea from "@mui/joy/Textarea";
import Start from "../../../Assets/Start.svg";
import Call from "../../../Assets/Call.svg";
import File from "../../../Assets/File.svg";
import Agent from "../../../Assets/Agent.svg";
import VisitedImg from "../../../Assets/visitedimg.png";
import Missedcall from "../../../Assets/Missedcall.svg";
import Voicemail from "../../../Assets/Voicemail.svg";
import Roundsms from "../../../Assets/Roundsms.svg";
import Sms from "../../../Assets/SMS.svg";
import Roundmail from "../../../Assets/Email.svg";
import Mail from "../../../Assets/Email-i.svg";
import Roundmessage from "../../../Assets/RoundMsg.svg";
import Message from "../../../Assets/Messenger.svg";
import User from "../../../Assets/User.svg";
import Reschedule from "../../../Assets/Reschedule.svg";
import Tick from "../../../Assets/Completed.svg";
import Warning from "../../../Assets/Incomplete.svg";
import Cancel from "../../../Assets/cancel.png";
import Visited from "../../../Assets/Visited.svg";
import Revisit from "../../../Assets/RescheduledVisit.svg";
import Missedvisit from "../../../Assets/MissedVisit.svg";
import DateCalendar from "../../../Assets/calender_icon.png";
import "react-datepicker/dist/react-datepicker.css";
import "./History.css";
import { usePerson } from "../../../COMPONENTS/Context";
import Cookies from "js-cookie";
import Hollowtick from "../../../Assets/tick.svg";
import Button from "@mui/material/Button";
import { position } from "@chakra-ui/react";
import BeatLoader from "../../../COMPONENTS/BeatLoader";
import InteractionDropdown from "../../../Dropdown/InteractionDropdown";
import Select from "react-select";
import CryptoJS from 'crypto-js';

const SECRET_KEY = process.env.REACT_APP_SECRET_KEY;

// Modal.setAppElement('#root');

const steps = [
  {
    icon: Call,
    subicon: File,
    call: "Call :",
    date: "06/21 - 12:07 PM",
    content: "Hello. Thank you for calling...",
  },
  {
    icon: Missedcall,
    subicon: Voicemail,
    call: "Missed Call :",
    date: "06/21 - 12:07 PM",
    content: "Hi. I saw your commercial and wanted to learn more. Call me...",
  },
  {
    icon: Roundsms,
    subicon: Sms,
    call: "SMS :",
    date: "06/21 - 12:07 PM",
    content:
      "Yes, I will be available this afternoon. Please have them ready...",
  },
  {
    icon: Roundmail,
    subicon: Mail,
    call: "Email :",
    date: "06/21 - 12:07 PM",
    content: "Thank you for your assistance.",
  },
  {
    icon: Roundmessage,
    subicon: Message,
    call: "Messenger :",
    date: "06/21 - 12:07 PM",
    content: "Thank you for your assistance.",
  },
  {
    icon: User,
    call: "Lead Created :",
    date: "06/21 - 12:07 PM",
    content: "",
  },
  {
    icon: User,
    call: "Client as of :",
    date: "06/21 - 12:07 PM",
    content: "",
  },
  {
    icon: Reschedule,
    call: "Reschedule :",
    date: "06/21 - 12:07 PM",
    content: "",
    img: { Hollowtick },
  },
  {
    icon: Tick,
    call: "Completed first Task as of :",
    date: "07/21 - 12:07 PM",
    content: "",
  },
  {
    icon: Warning,
    call: "First Task incomplete as of :",
    date: "07/21 - 12:07 PM",
    content: "",
  },
  {
    icon: Tick,
    call: "Completed 13 months of Project as of :",
    date: "06/21 - 12:07 PM",
    content: "",
  },
  {
    icon: Warning,
    call: "Did not complete 13 months of Task as of :",
    date: "07/21 - 12:07 PM",
    content: "",
  },
];

const CustomStepIconWithLine = ({ src, className, showLine }) => (
  <div className="step-icon-container">
    <img src={src} alt="step icon" className={className} />
    {showLine && <div className="vertical-dashed-line"></div>}
  </div>
);


dayjs.extend(utc);
dayjs.extend(timezone);

export default function History({fetchPersonalInfo, fetchUserNetworks, fetchRescheduleData, fetchRescheduleDataNetworks}) {
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
  const api = process.env.REACT_APP_API
  const timezoneString = 'America/New_York'; 

  const username = decrypt(Cookies.get("name"));
  const email = decrypt(Cookies.get("email"));
  const { selectedPersonId } = usePerson();
  const [activeStep, setActiveStep] = useState(null);
  const [AddHistory, setAddHistory] = useState(false);
  const [type, setType] = useState("");
  const [note, setNote] = useState("");
  const [purpose, setPurpose] = useState("");
  const [created_date, setCreatedDate] = useState(dayjs().tz(timezoneString));
  const [scheduled_date, setScheduledDate] = useState(dayjs());
  const [points, setPoints] = useState(0);
  const [historyRecords, setHistoryRecords] = useState([]);
  const [history, setHistory] = useState([]);
  const [totalCount, setTotalCount] = useState(0); // State to store the count
  const [modalIsOpen, setModalIsOpen] = useState(false);
  const [selectedItem, setSelectedItem] = useState(null);
  const [markcomplete, setmarkcomplete] = useState(null);
  const [image1open, setImage1open] = useState(false);
  const [image2open, setImage2open] = useState(false);
  const [error, setError] = useState('');
  const [imagePath1, setImagePath1] = useState(null);
  const [imagePath2, setImagePath2] = useState(null);
  const [preview1, setPreview1] = useState(null);
  const [preview2, setPreview2] = useState(null);
  const [loading, setLoading] = useState(true);
  const [loadingStates, setLoadingStates] = React.useState({});
  const [dataChanged, setDataChanged] = useState(false);

  const handleFileChange1 = (e) => {
    const file = e.target.files[0];
    if (file) {
      setPreview1(URL.createObjectURL(file));
      uploadFile(file, setImagePath1, 'Image1');
    }
  };

  const handleFileChange2 = (e) => {
    const file = e.target.files[0];
    if (file) {
      setPreview2(URL.createObjectURL(file));
      uploadFile(file, setImagePath2, 'Image2');
    }
  };

  const uploadFile = (file, setImagePath, label) => {
    const formData = new FormData();
    formData.append('file', file);

    fetch(api + '/upload', {
      method: 'POST',
      body: formData,
    })
      .then(response => response.json())
      .then(data => {
        if (data.path) {
          setImagePath(data.path);
          // console.log(`${label}: ${data.path}`);
        } else {
          console.error('Error: Image path not returned');
        }
      })
      .catch(error => {
        console.error('Error uploading image:', error);
      });
  };

  // console.log("path1: ",imagePath1);
  // console.log("path2: ",imagePath2);
  
  const pointsMapping = {
    Call: 3,
    "Missed Call": 0,
    "Reschedule Call": 0,
    SMS: 4,
    Email: 5,
    Messenger: 8,
    "Lead Created": 10,
    "Client as of": 15,
    Visited: 10,
    "Missed Visit": 0,
    "Rescheduled Visit": 2,
    "Completed Task": 20,
    "Incompleted Task": 0,
  };

  const typeImageMapping = {
    Call: Call,
    "Missed Call": Missedcall,
    "Reschedule Call": Reschedule,
    SMS: Roundsms,
    Email: Roundmail,
    Messenger: Roundmessage,
    "Lead Created": User,
    "Client as of": User,
    Visited: Visited,
    "Missed Visit": Missedvisit,
    "Rescheduled Visit": Revisit,
    "Completed Task": Tick,
    "Incompleted Task": Warning,
  };

  const logMapping = {
    Call: "Call Log",
    "Missed Call": "Call Log",
    "Reschedule Call": "Call Log",
    SMS: "SMS Log",
    Email: "Mail Log",
    Messenger: "Messenger Log",
    "Lead Created": "User Log",
    "Client as of": "User Log",
    Visited: "Visited Log",
    "Missed Visit": "Visited Log",
    "Rescheduled Visit": "Visited Log",
    "Completed Task": "Work Log",
    "Incompleted Task": "Work Log",
  };

  const handleStepClick = (index) => {
    setActiveStep(index === activeStep ? null : index);
  };

  const handleCloseAddHistory = () => {
    setNote("");
    setPurpose("");
    setCreatedDate(null);
    setScheduledDate(null);
    setType(""); 
    setAddHistory(false);
    setImagePath1(null);
    setImagePath2(null);
  };

  const handledate = (newDate) => {
    // Ensure the time is converted and stored in the correct timezone
    const localizedDate = newDate.tz(timezoneString);
    setCreatedDate(localizedDate);
    // console.log('Selected Date/Time:', localizedDate.format('YYYY-MM-DD HH:mm:ss Z')); // Logs in local timezone
  };

  const handlescheduleddate = (newDate) => {
    // Ensure the time is converted and stored in the correct timezone
    const localizedDate = newDate.tz(timezoneString);
    setScheduledDate(localizedDate);
    // console.log('Selected Date/Time:', localizedDate.format('YYYY-MM-DD HH:mm:ss Z')); // Logs in local timezone
  };
  const statusMapping = (type) => {
    if (type === "Reschedule Call" || type === "Rescheduled Visit") {
      return 1;
    }
    return 0;
  };

  const handleTypeClick = (selectedType) => {
    setType(selectedType.type);
    setPoints(pointsMapping[selectedType.type] || 0);
  };

  const handlemarkcompleted = (item) => {
    // Set loading state to true for the specific item
    setLoadingStates((prevState) => ({
      ...prevState,
      [item.history_id]: true, // Set loading to true for the specific item
    }));
  
    const updateData = {
      history_id: item.history_id,
      status: 0,
    };
  
    fetch(api + "/history-status", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(updateData),
    })
      .then((response) => {
        if (!response.ok) {
          return response.json().then((err) => {
            // throw new Error(`Server error: ${response.status}, ${err.message}`);
          });
        }
        return response.json();
      })
      .then((data) => {
        // console.log("Status updated successfully:", data);
  
        // Update the state of the specific item in the frontend
        fetchHistory();
        fetchRescheduleData();
        fetchRescheduleDataNetworks();
        fetchPersonalInfo();
        fetchUserNetworks();
        setHistoryRecords((prevRecords) =>
          prevRecords.map((record) =>
            record.history_id === item.history_id
              ? { ...record, status: 0 }
              : record
          )
        );
  
        // Delay setting the loading state to false for the specific item
        setTimeout(() => {
          setLoadingStates((prevState) => ({
            ...prevState,
            [item.history_id]: false, // Set loading to false for the specific item
          }));
        }, 1000);
      })
      .catch((error) => {
        fetchRescheduleData();
        fetchRescheduleDataNetworks();
        // console.error("Error updating status:", error);
  
        // Ensure loader is hidden if there's an error
        setLoadingStates((prevState) => ({
          ...prevState,
          [item.history_id]: false,
        }));
      });
      fetchRescheduleData();
      fetchRescheduleDataNetworks();
  };  
  
  const handleAdd = (e) => {
    setError('');
    // console.log('clicked');
    e.preventDefault();
    
    setCreatedDate(null);
    setScheduledDate(null);
    
    if (type === "") {
      setError("Please select the type of Conversation");
      return;
    }
    if (type === "Reschedule Call" || type === "Rescheduled Visit") {
      if (scheduled_date === null) {
        setError("Please provide a scheduled date for rescheduling");
        return;
      }
    }
    if (note === "") {
      setError("Fill the notes");
      return;
    }
    if(type === "Visited"){
      if (imagePath1 === null || imagePath2 === null) {
        setError("Insert both the images");
        return;
      }  
    }

    // if()
  
    // Clear form fields after validation
  
    const data = {
      selectedPersonId,
      username,
      email,
      type: type || "",
      note,
      purpose,
      points,
      scheduled_date: scheduled_date,
      // ? scheduled_date.tz("America/New_York").format() : "",
      imagePath1,
      imagePath2,
      status: type === "Reschedule Call" || type === "Rescheduled Visit" || type === "Visited" ? 1 : 0,
    };
  
    // console.log("Data being sent:", JSON.stringify(data));
  
    // Make the API call to add the history record
    fetch(api + "/addhistory", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(data),
    })
      .then((response) => {
        if (!response.ok) {
          return response.json().then((err) => {
            throw new Error(`Server error: ${response.status}, ${err.message}`);
          });
        }
        return response.json();
      })
      .then((newRecord) => {
        // console.log("Record added:", newRecord);
        // Update the local state with the new record
        setHistoryRecords((prevRecords) => [...prevRecords, newRecord]);
        fetchHistory(); // Fetch the updated history immediately after adding new record
        handleCloseAddHistory();
        fetchRescheduleData();
        fetchRescheduleDataNetworks();
        fetchPersonalInfo();
        fetchUserNetworks();
        setNote("");
        setCreatedDate(null);
        setScheduledDate(null);
        setType("");
        setImagePath1(null);
        setImagePath2(null);
      })
      .catch((error) => {
        console.error("Error:", error);
      });
  };
  
  // Fetch History Function
  const fetchHistory = async () => {
    setLoading(true);
    try {
      const response = await fetch(api + "/history", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ selectedPersonId }),
      });
  
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
  
      const data = await response.json();
  
      if (data && data.data && Array.isArray(data.data)) {
        setHistory(data.data); // Set history data
        setTotalCount(data.totalCount); // Set total count
      } else {
        console.error("Unexpected response structure:", data);
      }
    } catch (error) {
      console.error("Error fetching history:", error);
    } finally {
      setLoading(false);
    }
  };
  
  // UseEffect to fetch data on component mount or when selectedPersonId changes
  useEffect(() => {
    if (selectedPersonId) {
      fetchHistory(); // Fetch data initially when the component mounts or selectedPersonId changes
    }
  }, [selectedPersonId]);
  


  const openModal = (item) => {
    setSelectedItem(item);
    setModalIsOpen(true);
  };

  const closeModal = () => {
    setModalIsOpen(false);
    setSelectedItem(null);
  };

  const typeOptions = [
    { type: "Call", icon: Call },
    { type: "Missed Call", icon: Missedcall },
    { type: "Reschedule Call", icon: Reschedule },
    { type: "SMS", icon: Sms },
    { type: "Email", icon: Mail },
    { type: "Messenger", icon: Message },
    { type: "Lead Created", icon: User },
    { type: "Client as of", icon: User },
    { type: "Visited", icon: Visited },
    { type: "Missed Visit", icon: Missedvisit },
    { type: "Rescheduled Visit", icon: Revisit },
    { type: "Completed Task", icon: Tick },
    { type: "Incompleted Task", icon: Warning },
  ];

  const shouldShowScheduledDate =
    type === "Reschedule Call" || type === "Rescheduled Visit" ;

  const showvisitimage = type === "Visited";

  const typeTextMapping = {
    Call: "Call Log",
    "Missed Call": "Call Log",
    "Reschedule Call": "Call Log",
    SMS: "SMS Log",
    Email: "Mail Log",
    Messenger: "Messenger Log",
    "Lead Created": "User Log",
    "Client as of": "User Log",
    Visited: "Visited Log",
    "Missed Visit": "Visited Log",
    "Rescheduled Visit": "Visited Log",
    "Completed Task": "Work Log",
    "Incompleted Task": "Work Log",
  };

  const textColorMapping = {
    Call: "#6E6F72",
    "Missed Call": "#AD1111",
    "Reschedule Call": "#ED8F03",
    SMS: "#6E6F72",
    Email: "#6E6F72",
    Messenger: "#6E6F72",
    "Lead Created": "#64696C",
    "Client as of": "#64696C",
    Visited: "#6E6F72",
    "Missed Visit": "#AD1111",
    "Rescheduled Visit": "#ED8F03",
    "Completed Task": "#64696C",
    "Incompleted Task": "#AD1111",
  };

  const bgcolorMapping = {
    Call: "#EDF3F7",
    "Missed Call": "#FEECEC",
    "Reschedule Call": "#FBE9D0",
    SMS: "#EDF3F7",
    Email: "#EDF3F7",
    Messenger: "#EDF3F7",
    "Lead Created": "#EDF3F7",
    "Client as of": "#EDF3F7",
    Visited: "#EDF3F7",
    "Missed Visit": "#FEECEC",
    "Rescheduled Visit": "#FBE9D0",
    "Completed Task": "#EDF3F7",
    "Incompleted Task": "#FEECEC",
  };

  const handleChange = (selectedOption) => {
    // `selectedOption` is an object, or `null` if no option is selected
    setPurpose(selectedOption ? selectedOption.value : null);
  };

  return (
    <div className="history-main">
      <h3 style={{fontSize: '15px'}}>TotalCount: {totalCount}</h3>
      <button
        className="history-add-button"
        onClick={() => {
          setAddHistory(true);  // Update addHistory state
          setError('');         // Clear the error message
        }}>
        Add<i className="fa-solid fa-square-plus"></i>
      </button>
      <div className="history-container">
      <Stepper activeStep={activeStep} orientation="vertical">
        {loading ? (
          <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '35vh' }}>
            <BeatLoader loading={loading} color="#2867B2" size={15} />
          </div>
        ) : (
          <>
            {history.length === 0 ? (
              <div className="empty-error">
                <div>
                  <i className="fa-solid fa-circle-info"></i>
                  <p>No data found. Please log to Display Data!</p>
                </div>
              </div>
            ) : (
              history.map((item, index) => (
                <Step key={index}>
                  <StepLabel
                    StepIconComponent={() => (
                      <CustomStepIconWithLine
                        src={typeImageMapping[item.type]}
                        className="step-icon"
                        showLine={false}
                      />
                    )}
                  >
                    <div className="calll">
                      <div className="call-title">{item.type}</div>
                      <div className="date" style={{ display: 'flex', width: '100%' }}>
                        {new Date(item.datetime).toLocaleString()}
                        {(item.type === 'Reschedule Call' || item.type === 'Rescheduled Visit' || item.type === 'Visited' ) && (
                          <div className="schedule-progress-container">
                            {item.status === 1 && (
                              <div
                                className="schedule-progress"
                                onClick={() => handlemarkcompleted(item)}
                                style={{ backgroundColor: '#FEECEC' }}
                              >
                                <i
                                  className="fa-regular fa-circle-check"
                                  style={{ marginLeft: '4%', fontSize: '140%', color: '#AD1111' }}
                                ></i>
                                <p style={{ marginLeft: '5%', color: '#AD1111' }}>Mark Complete</p>
                              </div>
                            )}
                            {item.status === 0 && (
                              <div>
                                {loadingStates[item.history_id] ? (
                                  <div
                                    style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100%' }}
                                  >
                                    <BeatLoader loading={loadingStates[item.history_id]} color="#2867B2" size={10} />
                                  </div>
                                ) : (
                                  <div className="schedule-progress" style={{ backgroundColor: '#c1f0b6' }}>
                                    <i className="fa-solid fa-circle-check" style={{ fontSize: '140%', color: 'green' }}></i>
                                    <p style={{ marginLeft: '5%', color: 'green' }}>Completed</p>
                                  </div>
                                )}
                              </div>
                            )}
                          </div>
                        )}
                        
                      </div>
                    </div>
                    <div className="file-container">
                        <img src={File} alt="file" className="fileimg" />
                        <p className="file-content">
                            <div style={{ width: "35vw" }}>{item.note}</div>
                            <i
                              style={{ cursor: "pointer" }}
                              onClick={() => openModal(item)}
                              className="fa-solid fa-chevron-right"></i>
                          </p>
                      </div>
                      <div className="agent-container">
                        <img src={Agent} alt="agent" className="agentimg" />
                        <p className="agent-content">{item.agent}</p>
                      </div>
                      {item.type === 'Visited' && (
                        <div style={{ marginLeft: '0%', color: 'grey' }} className="agent-container">
                          <img src={VisitedImg} alt="visitedimg" className="agentimg" />
                          <button className="visited-img" onClick={() => setImage1open(true)}>Image 1</button>
                          <button className="visited-img" onClick={() => setImage2open(true)} style={{ marginLeft: '2%' }}>
                            Image 2
                          </button>
                          <Dialog open={image1open} onClose={() => setImage1open(false)} >
                            <div style={{width: "20vw"}} >
                            <img style={{width: "100%",height: "100%"}}  src={`${api}${item.visited1}`}/>
                            </div>
                          </Dialog>
                          <Dialog open={image2open} onClose={() => setImage2open(false)}>
                          <div style={{width: "20vw"}} >
                            <img style={{width: "100%",height: "100%"}}  src={`${api}${item.visited2}`} alt="" />
                            </div>
                          </Dialog>
                        </div>
                      )}
                  </StepLabel>
                  <StepContent>
                    <Typography>
                      
                      
                      <div className="agent-container">
                        <img src={Agent} alt="agent" className="agentimg" />
                        <p className="agent-content">{item.agent}</p>
                      </div>
                    </Typography>
                  </StepContent>
                </Step>
              ))
            )}
          </>
        )}
      </Stepper>
    </div>

      <Dialog
        className="popaddhistory"
        open={AddHistory}
        onClose={handleCloseAddHistory}>
        <form onSubmit={handleAdd}>
          <div className="addhistory-overlay">
            <div className="addhistory">
              <div className="dialog-header">
                <h2 className="addhistory-top">
                  Add History
                  <img
                    src={Cancel}
                    alt="cancel-img"
                    className="cancel-img"
                    onClick={handleCloseAddHistory}></img>
                </h2>
              </div>
              <div className="addhistory-body">
                <div className="call-type">
                  <label
                    style={{
                      fontWeight: "600",
                      fontSize: "14px",
                      marginLeft: "0%",
                    }}>
                    <span
                      className="compl"
                      style={{ color: "red", marginRight: "1%" }}>
                      *
                    </span>
                    Type:
                  </label>
                  <div className="type-buttons">
                    {typeOptions.map((button) => (
                      <button
                        key={button.type}
                        type="button"
                        className={`btn1 ${
                          type === button.type ? "selected" : ""
                        }`}
                        onClick={() => handleTypeClick(button)}>
                        <div className="Btn-container">
                          <img
                            src={button.icon}
                            alt=""
                            className="addhistoryimg"></img>
                          {button.type}
                        </div>
                      </button>
                    ))}
                  </div>
                </div>

                <div className="form-group" style={{ marginTop: "5%" }}>
                  <label
                    style={{
                      fontWeight: "600",
                      fontSize: "14px",
                      marginLeft: "0%",
                    }}>
                    <span
                      className="compl"
                      style={{ color: "red", marginRight: "1%" }}>
                      *
                    </span>
                    Note:
                  </label>
                  <Box>
                    <Textarea
                      placeholder="Write a short note..."
                      style={{ marginTop: "2%" }}
                      className="addhistory-textarea"
                      value={note}
                      onChange={(e) => setNote(e.target.value)}
                    />
                  </Box>
                </div>

                <div className="form-group" style={{ marginTop: "5%",gap: "0.7rem",display: "flex",flexDirection: "column" }}>
                  <label
                    style={{
                      fontWeight: "600",
                      fontSize: "14px",
                      marginLeft: "0%",
                    }}>
                    Purpose of Interactions:
                  </label>
                  <InteractionDropdown style={{marginTop: '20px'}} purpose={purpose} setPurpose={setPurpose} handleChange={handleChange}/>
                  {/* <Select 
                    placeholder = 'Select type of Conversation'
                    style={{marginTop: '20px'}}
                    options={options}
                    onChange={handleChange}
                    isClearable
                  /> */}
                </div>

                {/* <div style={{ display: "flex", marginTop: "8%" }}>
                  <label style={{ fontWeight: "500" }}>Date/Time : </label>
                  <div style={{ marginTop: "-4%", marginLeft: "2%" }}>
                    <LocalizationProvider dateAdapter={AdapterDayjs}>
                      <DateTimePicker
                         label="Select Time"
                         value={created_date}
                         onChange={handledate}
                      />
                    </LocalizationProvider>
                  </div>
                </div> */}
                

                {shouldShowScheduledDate && (
                  <div style={{ display: "flex", marginTop: "8%" }}>
                    <label style={{ fontWeight: "500" }}>
                      Scheduled Date :{" "}
                    </label>
                    <div style={{ marginTop: "-4%", marginLeft: "3%" }}>
                      <LocalizationProvider dateAdapter={AdapterDayjs}>
                        <DateTimePicker
                          label="Select Time"
                          value={scheduled_date}
                          onChange={handlescheduleddate}
                        />
                      </LocalizationProvider>
                    </div>
                  </div>
                )}
               {showvisitimage && (
                 <div className="image-uploader-container">
                 <div className="image-uploader-content">
                   <div className="image-uploader-row">
                     <div className="image-uploader-buttons">
                       {preview1 ? (
                         <div className="image-preview-container">
                           <img src={preview1} alt="Uploaded 1" className="image-preview" />
                           <button onClick={() => setPreview1(null)} className="cancel-button">
                             X
                           </button>
                         </div>
                       ) : (
                         <Button variant="outlined" component="label" className="upload-button">
                           <i className="fa-solid fa-cloud-arrow-up" style={{ marginRight: '5px' }}></i>
                           Upload Image - 1
                           <input type="file" accept="image/*" hidden onChange={handleFileChange1} />
                         </Button>
                       )}
                     </div>
                   </div>
           
                   <div className="image-uploader-row">
                     <div className="image-uploader-buttons">
                       {preview2 ? (
                         <div className="image-preview-container">
                           <img src={preview2} alt="Uploaded 2" className="image-preview" />
                           <button onClick={() => setPreview2(null)} className="cancel-button">
                             X
                           </button>
                         </div>
                       ) : (
                         <Button variant="outlined" component="label" className="upload-button">
                           <i className="fa-solid fa-cloud-arrow-up" style={{ marginRight: '5px' }}></i>
                           Upload Image - 2
                           <input type="file" accept="image/*" hidden onChange={handleFileChange2} />
                         </Button>
                       )}
                     </div>
                   </div>
                 </div>
               </div>    
      )}
              </div>
              <div className="addhistory-footer">
                <button
                  type="button"
                  className="discard-addhistory"
                  onClick={handleCloseAddHistory}>
                  Discard
                </button>
                <button
                  type="submit"
                  className="add-addhistory"
                  onClick={(e) => {
                    handleAdd(e);
                    // handleCloseAddHistory(e);
                  }}>
                  Add
                </button>
                <button
                  type="button"
                  className="createanother-addhistory"
                  onClick={handleAdd}>
                  Add & Create Another
                </button>
              </div>
            </div>
            <p style={{textAlign: 'center',color: 'red', marginTop: '5px'}}>{error}</p>
          </div>
        </form>
      </Dialog>

      {selectedItem && (
        <Dialog
          open={modalIsOpen}
          onClose={closeModal}
          PaperProps={{ style: { width: "500px" } }}>
          <div className="modal-content">
            <div style={{ display: "flex" }}>
              <p
                style={{
                  fontSize: "20px",
                  fontWeight: "700",
                  width: "95%",
                }}>
                {typeTextMapping[selectedItem.type]}
              </p>
              <img src={Cancel} className="close-dialog" onClick={closeModal} />
            </div>
            <div>
              <div
                style={{
                  display: "flex",
                  alignItems: "center",
                  marginTop: "2%",
                }}>
                <Typography
                  variant="h6"
                  style={{ marginTop: "8%", display: "flex" }}>
                  <p style={{ fontSize: "15px", fontWeight: "700" }}>Type:</p>
                  <div
                    style={{
                      display: "flex",
                      margin: "-1% 0% 0% 7%",
                      padding: "1% 1% 1% 1%",
                      backgroundColor: bgcolorMapping[selectedItem.type],
                      width: "14vw",
                      borderRadius: "10px",
                    }}>
                    <img
                      src={typeImageMapping[selectedItem.type]}
                      alt={selectedItem.type}
                      style={{ marginLeft: "6%", width: "22px" }}
                    />
                    <p
                      style={{
                        fontSize: "15px",
                        margin: "0% 0% 0% 10%",
                        color: textColorMapping[selectedItem.type],
                      }}>
                      {selectedItem.type}
                    </p>
                  </div>
                </Typography>
              </div>

              <Typography
                variant="body2"
                style={{ marginTop: "5%", display: "flex" }}>
                <p style={{ fontSize: "15px", fontWeight: "700" }}>
                  Date/Time:
                </p>
                <div
                  style={{
                    margin: "0% 0% 0% 5%",
                    width: "13.4vw",
                    display: "flex",
                    backgroundColor: bgcolorMapping[selectedItem.type],
                    padding: "0% 2% 0% 2%",
                    height: "4vh",
                    borderRadius: "10px",
                    alignItems: "center",
                  }}>
                  <img
                    src={DateCalendar}
                    alt="calender img"
                    style={{
                      width: "16px",
                      height: "16px",
                      marginTop: "0%",
                      marginLeft: "4%",
                    }}></img>
                  <p
                    style={{
                      fontSize: "14px",
                      marginLeft: "3%",
                      color: textColorMapping[selectedItem.type],
                    }}>
                    {new Date(selectedItem.datetime).toLocaleString()}
                  </p>
                </div>
              </Typography>
              {/* {(selectedItem.type == "Reschedule Call" || "Rescheduled visit" ) && ( */}
            </div>
            {(selectedItem.type == "Reschedule Call" ||
              selectedItem.type == "Rescheduled Visit") && (
              <Typography
                variant="body2"
                style={{ marginTop: "5%", display: "flex" }}>
                <p style={{ fontSize: "15px", fontWeight: "700" }}>
                  Scheduled Date:
                </p>
                <div
                  style={{
                    margin: "0% 0% 0% 5%",
                    width: "12.4vw",
                    display: "flex",
                    backgroundColor: bgcolorMapping[selectedItem.type],
                    padding: "0% 2% 0% 2%",
                    height: "4vh",
                    borderRadius: "10px",
                    alignItems: "center",
                  }}>
                  <img
                    src={DateCalendar}
                    alt="calender img"
                    style={{
                      width: "16px",
                      height: "16px",
                      marginTop: "0%",
                      marginLeft: "4%",
                    }}></img>
                  <p
                    style={{
                      fontSize: "14px",
                      marginLeft: "3%",
                      color: textColorMapping[selectedItem.type],
                    }}>
                    {new Date(selectedItem.scheduleddate).toLocaleString()}
                  </p>
                </div>
              </Typography>
            )}

            <Typography variant="body2" style={{ marginTop: "3%" }}>
              <p
                style={{
                  fontSize: "15px",
                  marginTop: "3%",
                  fontWeight: "700",
                }}>
                Note:
              </p>
              <p
                style={{
                  border: "2px solid #A4B4D4",
                  borderRadius: "10px",
                  height: "10vh",
                  padding: "2%",
                  margin: "1% 0% 0% 0%",
                }}>
                {selectedItem.note}
              </p>
            </Typography>

            {selectedItem.purpose !== ''? (
              <Typography variant="body2" style={{ marginTop: "3%" }}>
                <p
                  style={{
                    fontSize: "15px",
                    marginTop: "3%",
                    fontWeight: "700",
                  }}>
                  Purpose:
                </p>
                <p
                  style={{
                    border: "2px solid #A4B4D4",
                    borderRadius: "10px",
                    height: "10vh",
                    padding: "2%",
                    margin: "1% 0% 0% 0%",
                  }}>
                  {selectedItem.purpose}
                </p>
              </Typography>
            ):('')}
            {selectedItem.type === "Visited" && (
              <div
                style={{
                  display: "flex",
                  alignItems: "center",
                  marginTop: "8%",
                }}>
                <label
                  style={{
                    marginRight: "3%",
                    fontSize: "15px",
                    fontWeight: "700",
                  }}>
                  Visited Proof:
                </label>
                <div style={{display: 'flex', gap: '20px'}}>
                  <img
                    src={`${api}${selectedItem.visited1}`}
                    alt="Visited Proof"
                    style={{
                      width: "100px",
                      height: "100px",
                      objectFit: "cover",
                      borderRadius: "8px",
                      border: "1px solid #ccc",
                    }}
                  />
                  <img
                    src={`${api}${selectedItem.visited2}`}
                    alt="Visited Proof"
                    style={{
                      width: "100px",
                      height: "100px",
                      objectFit: "cover",
                      borderRadius: "8px",
                      border: "1px solid #ccc",
                    }}
                  />
                </div>
              </div>
            )}

            <Typography
              variant="body2"
              style={{ display: "flex", marginTop: "5%" }}>
              <p style={{ fontSize: "15px", fontWeight: "700" }}>Handled by:</p>
              <p
                style={{
                  fontSize: "15px",
                  margin: "0% 0% 0% 3%",
                  color: "#2867B2",
                }}>
                {selectedItem.agent}
              </p>
            </Typography>
          </div>
        </Dialog>
      )}
    </div>
  );
}
