import React, { useState, useRef, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import Select from "react-select";
import "./Addaccount.css";
import { Dialog } from "@mui/material";
import Box from "@mui/joy/Box";
import Input from "@mui/joy/Input";
import Textarea from "@mui/joy/Textarea";
import Profile from "../../Assets/Profile.png";
import "react-circular-progressbar/dist/styles.css";
import Subconnections from "../../COMPONENTS/Dialogue/Subconnections";
import { usePerson } from "../../COMPONENTS/Context";
import { easeQuadInOut } from "d3-ease";
import {
  CircularProgressbarWithChildren,
  buildStyles,
} from "react-circular-progressbar";
import Cookies from "js-cookie";
import CryptoJS from "crypto-js";

const SECRET_KEY = "your-secret-key";

const ChangingProgressProvider = ({ value, children }) => {
  return children(value);
};
const decrypt = (ciphertext) => {
  if (ciphertext) {
    const bytes = CryptoJS.AES.decrypt(ciphertext, SECRET_KEY);
    return bytes.toString(CryptoJS.enc.Utf8);
  }
  return "";
};

const ShowAddAccount = () => {
  const email = decrypt(Cookies.get("email"));
  const token = decrypt(Cookies.get("token"));
  // const parsedProfile = userProfile ? JSON.parse(userProfile) : null;
  // const email = parsedProfile?.email;
  const navigate = useNavigate();
  const [person_1, setPerson_1] = useState(false);
  const [person_2, setPerson_2] = useState(false);
  const [progress_1, setProgress_1] = useState(0);
  const [file, setFile] = useState(null); // For the first image
  const [file2, setFile2] = useState(null); // For the second image
  const [imagePreview, setImagePreview] = useState(Profile);
  const [error, setError] = useState("");
  const [Person_Progress, setPerson_Progress] = useState(0);
  const { selectedPersonId } = usePerson();
  const [Completion, setCompletion] = useState(0);
  const [Total_Progress, setTotal_Progress] = useState(0);
  const [SubCompletion, setSubCompletion] = useState(0);
  const [SubTotal_Progress, setSubTotal_Progress] = useState(0);
  const [isPopupOpen, setIsPopupOpen] = useState(false);
  // const [SubConnections, setsubconnections] = useState();

  const [personInfo, setPersonInfo] = useState({
    fullname: "",
    phonenumber: "",
    age: "",
    email: "",
    dob: "",
    rating: "",
    visitingcard: "",
    linkedinurl: "",
    address: "",
    shortdescription: "",
    hashtags: "",
  });

  const [connectionInfo, setConnectionInfo] = useState({
    fullname: "",
    phonenumber: "",
    age: "",
    email: "",
    dob: "",  
    rating: "",
    visitingcard: "",
    linkedinurl: "",
    address: "",
    shortdescription: "",
    hashtags: "",
  });
  // console.log('add')

  const handleDetailsChange_1 = (e) => {
    const { name, value } = e.target;
    setPersonInfo((prevDetails_1) => ({
      ...prevDetails_1,
      [name]: value,
    }));
  };

  const handleSubconnectionsvalue = (e) => {
    const { name, value } = e.target;
    setConnectionInfo((prevDetails_1) => ({
      ...prevDetails_1,
      [name]: value,
    }));
  };

  const location = useLocation();
  const subConnections = location.state?.subConnections;

  // console.log('SubConnections:', subConnections);

  const handlePersonInput = () => {
    console.log('inside')
    if (subConnections === 1) {
      setPerson_1(true);
    } else if (subConnections === 2) {
      setPerson_2(true);
    }
  };
  // const CalculateProgress_Person = () => {
  //   const totalFields = Object.keys(personInfo).length;
  //   if (totalFields === 0) return 0; // Avoid division by zero
  //   const filledFields = Object.values(personInfo).filter(
  //     (value) => value !== ""
  //   ).length;
  //   const Completion = (filledFields / totalFields) * 100;
  //   setCompletion(Completion);
  //   setPerson_Progress(Completion);
  //   return Completion;
  //   // console.log("staus = ",Completion);
  // };

  // const CalculateProgress_connections = () => {
  //   const totalFields = Object.keys(connectionInfo).length;
  //   if (totalFields === 0) return 0; // Avoid division by zero
  //   const filledFields = Object.values(connectionInfo).filter(
  //     (value) => value !== ""
  //   ).length;
  //   const Completion = (filledFields / totalFields) * 100;
  //   setCompletion(Completion);
  //   setconnection_Progress(Completion);
  //   return Completion;
  //   // console.log("staus = ",Completion);
  // };

  const fileInputRef = useRef(null);
  const fileInputRef2 = useRef(null);

  const handleClickOpen = () => {
    if (fileInputRef.current) {
      fileInputRef.current.click();
    }
  };
  const handleClickOpen2 = () => {
    if (fileInputRef2.current) {
      fileInputRef2.current.click();
    }
  };
  const [previewUrl1, setPreviewUrl1] = useState(null); // Preview URL for first image
  const [previewUrl2, setPreviewUrl2] = useState(null); // Preview URL for second image
  const [cardAdded, setCardAdded] = useState(false); // Track if card is added
  const [showPopup, setShowPopup] = useState(false); // Track popup visibility

  // Handle the file change for the first image
  const handleFileChange = (e) => {
    const selectedFile = e.target.files[0];
    setFile(selectedFile);

    // Create a preview URL
    if (selectedFile) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setPreviewUrl1(reader.result);
      };
      reader.readAsDataURL(selectedFile);
    }
  };

  // Handle the file change for the second image
  const handleFileChange2 = (e) => {
    const selectedFile = e.target.files[0];
    setFile2(selectedFile);

    // Create a preview URL
    if (selectedFile) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setPreviewUrl2(reader.result); // Set the preview URL
        setCardAdded(true); // Mark card as added
      };
      reader.readAsDataURL(selectedFile);
    }
  };

  // const handleFileChange = (e) => {
  //   const selectedFile = e.target.files[0];
  //   setFile(selectedFile);

  //   if (selectedFile) {
  //     const reader = new FileReader();
  //     reader.onloadend = () => {
  //       setImagePreview(reader.result);
  //     };
  //     reader.readAsDataURL(selectedFile);
  //   }
  // };

  const CalculateProgress_Person = () => {
    const totalFields = Object.keys(personInfo).length;
    const filledFields = Object.values(personInfo).filter(
      (value) => value !== ""
    ).length;
    const calculatedCompletion = (filledFields / totalFields) * 100;
    const totalCompletion = (filledFields / 43) * 100;
    setCompletion(calculatedCompletion);
    setTotal_Progress(totalCompletion);
    // console.log("Status = ",Completion);
  };

  useEffect(() => {
    CalculateProgress_Person();
  }, [personInfo]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    CalculateProgress_Person();

    let imagePath1 = null;
    let imagePath2 = null;

    // Check if the required fields are filled
    if (personInfo.fullname === "" || personInfo.phonenumber === "") {
      setError("Name and Phonenumber are required to create a connection");
      return;
    }

    // Upload the first image if it exists
    if (file) {
      const formData = new FormData();
      formData.append("file", file);

      try {
        const uploadResponse = await fetch(
          `${process.env.REACT_APP_API}/upload`,
          {
            method: "POST",
            body: formData,
          }
        );

        if (!uploadResponse.ok) {
          const text = await uploadResponse.text();
          console.error("Upload failed with status:", uploadResponse.status);
          console.error("Response text:", text);
          throw new Error("Network response was not ok");
        }

        const uploadData = await uploadResponse.json();
        imagePath1 = uploadData.path;
      } catch (error) {
        console.error("Error:", error);
        setError("An error occurred during file upload. Please try again.");
        return;
      }
    }

    // Upload the second image if it exists
    if (file2) {
      // Assume 'file2' is the state for the second file
      const formData2 = new FormData();
      formData2.append("file", file2);

      try {
        const uploadResponse = await fetch(
          `${process.env.REACT_APP_API}/upload`,
          {
            method: "POST",
            body: formData2,
          }
        );

        if (!uploadResponse.ok) {
          const text = await uploadResponse.text();
          console.error("Upload failed with status:", uploadResponse.status);
          console.error("Response text:", text);
          throw new Error("Network response was not ok");
        }

        const uploadData = await uploadResponse.json();
        imagePath2 = uploadData.path;
      } catch (error) {
        console.error("Error:", error);
        setError(
          "An error occurred during the second file upload. Please try again."
        );
        return;
      }
    }

    // Continue with the form submission
    try {
      const personResponse = await fetch(
        `${process.env.REACT_APP_API}/person`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({
            personInfo,
            imagePath1, // First image path
            imagePath2, // Second image path
            email,
            Completion: Completion,
            TotalProgress: Total_Progress,
          }),
        }
      );

      if (!personResponse.ok) {
        const text = await personResponse.text();
        console.error("Upload failed with status:", personResponse.status);
        console.error("Response text:", text);
        throw new Error("Network response was not ok");
      }

      const personData = await personResponse.json();
      setError("Saved Successfully. You may now close this popup");

      // Navigate to /dashboard after 2 seconds
      setTimeout(() => {
        window.location.href = "/bitcontacts/dashboard/admin";
      }, 2000);
    } catch (error) {
      console.error("Error:", error);
      setError("An error occurred. Please try again.");
    }

    e.target.value = null;
  };

  const CalculateProgress_Subconnections = () => {
    const totalFields = Object.keys(connectionInfo).length;
    const filledFields = Object.values(connectionInfo).filter(
      (value) => value !== ""
    ).length;
    const calculatedCompletion = (filledFields / totalFields) * 100;
    const totalCompletion = (filledFields / 43) * 100;
    setSubCompletion(calculatedCompletion);
    setSubTotal_Progress(totalCompletion);
    // console.log("Status = ",SubCompletion);
  };

  useEffect(() => {
    CalculateProgress_Subconnections();
  }, [personInfo]);

  const handleSubconnections = async (e) => {
    e.preventDefault();
    CalculateProgress_Subconnections();

    // Calculate the completion progress before submission
    let imagePath1 = null;
    let imagePath2 = null;
    if (connectionInfo.fullname === "" || connectionInfo.phonenumber === "") {
      setError("Name and Phonenumber are required to create a connection");
      return;
    }

    if (file) {
      const formData = new FormData();
      formData.append("file", file);

      try {
        const uploadResponse = await fetch(
          `${process.env.REACT_APP_API}/upload`,
          {
            method: "POST",
            body: formData,
          }
        );

        if (!uploadResponse.ok) {
          const text = await uploadResponse.text();
          console.error("Upload failed with status:", uploadResponse.status);
          console.error("Response text:", text);
          throw new Error("Network response was not ok");
        }

        const uploadData = await uploadResponse.json();
        // console.log('Imagepath: ', uploadData.path);
        imagePath1 = uploadData.path;
      } catch (error) {
        console.error("Error:", error);
        setError("An error occurred during file upload. Please try again.");
        return;
      }
    }

    try {
      const personResponse = await fetch(
        `${process.env.REACT_APP_API}/subconnections`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({
            email,
            selectedPersonId,
            connectionInfo,
            imagePath1, // Only send imagePath if a file was uploaded
            Completion: SubCompletion, // Use the calculated value directly
            TotalProgress: SubTotal_Progress,
          }),
        }
      );

      if (!personResponse.ok) {
        const text = await personResponse.text();
        console.error("Upload failed with status:", personResponse.status);
        console.error("Response text:", text);
        throw new Error("Network response was not ok");
      }

      const personData = await personResponse.json();
      setError("Saved Successfully. You may now close this popup");

      // Navigate to /dashboard after 3 seconds using window.location
      setTimeout(() => {
        window.location.href = "/bitcontacts/dashboard/admin";
      }, 2000);
    } catch (error) {
      console.error("Error:", error);
      setError("An error occurred. Please try again.");
    }

    e.target.value = null;
  };

  const handleViewClick = () => {
    setShowPopup(true);
  };

  // Close the popup
  const handleClosePopup = () => {
    setShowPopup(false);
  };

  const handleRemoveImage = () => {
    setFile2(null); // Clear the selected file
    setPreviewUrl2(null); // Clear the preview URL
    setCardAdded(false); // Reset the card added state
  };

  const formatDateForInput = (isoString) => {
    const date = new Date(isoString);
    const year = date.getFullYear();
    const month = (date.getMonth() + 1).toString().padStart(2, "0");
    const day = date.getDate().toString().padStart(2, "0");
    return `${year}-${month}-${day}`;
  };

  const formattedDate = formatDateForInput(personInfo.dob);

  const options = [
    { label: "Higly Recommended", value: "Higly Recommended" },
    { label: "Recommended", value: "Recommended" },
  ];

  const handleRatingchange = (selectedOption) => {
    setPersonInfo((prevDetails_1) => ({
      ...prevDetails_1,
      rating: selectedOption.value,  // Store the selected value
    }));
  }

  return (
    <div className="add-account-main">
      <div className="addaccount">
        <div className="inputs_page">
          <div>
            {/* <h1>Completion from props: {personInfo.Completion}%</h1> */}
            <h1 className="addacc">Add Account</h1>
            <p className="period2req">
              <h6 className="period2">.</h6>
              <span className="req">Required to save as client.</span>
            </p>
          </div>
          {/* <div className="buttonContainer2">
            <button color="primary" className="addconnection-discard">
              Discard
            </button>
            <button
              color="primary"
              className="addconnection-save"
              onClick={handleSubmit}
            >
              Save changes
            </button>
          </div> */}
          {/* <h1>{Completion}</h1> */}
        </div>
        <div className="add-connection-inputs">
          <a1
            onClick={handlePersonInput}
            className="addconnections-a1-flow"
            style={{ cursor: "pointer" }}
          >
            <span className="addconnection-topics-flowchart">
              <ChangingProgressProvider value={Completion}>
                {(value) => (
                  <CircularProgressbarWithChildren
                    backgroundPadding={50}
                    value={value}
                    circleRatio={0.75}
                    styles={buildStyles({
                      rotation: 1 / 2 + 1 / 8,
                      strokeLinecap: "butt",
                      trailColor: "#C8D1D8",
                      pathColor: value > 0 ? "#122E50" : "transparent",
                    })}
                  >
                    <div
                      className="addconnection-person-icon"
                      style={{ textAlign: "center" }}
                    >
                      <svg
                        className="svg"
                        xmlns="http://www.w3.org/2000/svg"
                        viewBox="0 0 24 24"
                        width={18}
                        height={27}
                        color={"#122E50"}
                        fill={"none"}
                        style={{ display: "block", margin: "0 auto" }}
                      >
                        <path
                          d="M9.13435 2.5C6.46808 2.56075 4.91073 2.81456 3.84667 3.87493C2.9154 4.80297 2.60409 6.10756 2.50003 8.2M14.8657 2.5C17.532 2.56075 19.0893 2.81456 20.1534 3.87493C21.0847 4.80297 21.396 6.10756 21.5 8.2M14.8657 21.5C17.532 21.4392 19.0893 21.1854 20.1534 20.1251C21.0847 19.197 21.396 17.8924 21.5 15.8M9.13435 21.5C6.46808 21.4392 4.91073 21.1854 3.84667 20.1251C2.9154 19.197 2.60409 17.8924 2.50003 15.8"
                          stroke="currentColor"
                          strokeWidth="1.5"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                        />
                        <path
                          d="M7.50003 17C9.83173 14.5578 14.1433 14.4428 16.5 17M14.4951 9.5C14.4951 10.8807 13.3742 12 11.9916 12C10.6089 12 9.488 10.8807 9.488 9.5C9.488 8.11929 10.6089 7 11.9916 7C13.3742 7 14.4951 8.11929 14.4951 9.5Z"
                          stroke="currentColor"
                          strokeWidth="1.5"
                          strokeLinecap="round"
                        />
                      </svg>
                      <h6 style={{ margin: 0, color: "#122E50" }}>Person</h6>
                    </div>
                  </CircularProgressbarWithChildren>
                )}
              </ChangingProgressProvider>
            </span>
          </a1>
        </div>
      </div>
      <Dialog open={person_1} onClose={() => setPerson_1(false)}>
        <div
          className="dialogue"
          style={{
            gap: "15px",
            display: "flex",
            flexDirection: "column",
          }}
        >
          <h3
            style={{
              fontSize: "25px",
              fontFamily: "Open Sans, sans-serif",
            }}
          >
            Personal Information
          </h3>
          <div className="1stline" style={{ display: "flex", gap: "15px" }}>
            <Input
              placeholder="Full Name"
              name="fullname"
              style={{ flexGrow: 1 }}
              value={personInfo.fullname}
              onChange={handleDetailsChange_1}
            />
            <div>
              <input
                type="file"
                ref={fileInputRef}
                style={{ display: "none" }}
                onChange={handleFileChange}
                accept="image/*"
              />
              <div
                style={{
                  border: "1px",
                  borderRadius: "50px",
                  width: "40px",
                  height: "44px",
                }}
                onClick={handleClickOpen}
              >
                <img
                  className="addconnection-profilepic"
                  src={previewUrl1 || Profile}
                />
              </div>
            </div>
          </div>
          <div className="2ndline" style={{ display: "flex", gap: "15px" }}>
            <div style={{ flexGrow: "1" }}>
              <Input
                placeholder="Phone Number"
                name="phonenumber"
                type="number"
                value={personInfo.phonenumber}
                onChange={handleDetailsChange_1}
              />
            </div>
            <div style={{ flexGrow: "1" }}>
              <Input
                placeholder="Age"
                name="age"
                type="number"
                value={personInfo.age}
                onChange={handleDetailsChange_1}
              />
            </div>
          </div>
          <div
            className="3rdline"
            style={{ display: "flex", gap: "15px", flex: "2" }}
          >
            <Input
              placeholder="Email"
              name="email"
              style={{ flexGrow: 1 }}
              value={personInfo.email}
              onChange={handleDetailsChange_1}
            />
            <Input
              placeholder="Linkedin Url"
              name="linkedinurl"
              style={{ flexGrow: 1 }}
              value={personInfo.linkedinurl}
              onChange={handleDetailsChange_1}
            />
          </div>
          <div>
            <Box>
              <Textarea
                placeholder="Address"
                name="address"
                minRows={2}
                maxRows={4}
                value={personInfo.address}
                onChange={handleDetailsChange_1}
              />
            </Box>
          </div>
          <div className="container">
            {/* Hidden file input for selecting the image */}
            <input
              type="file"
              accept="image/*"
              style={{ display: "none" }}
              ref={fileInputRef2}
              onChange={handleFileChange2}
            />

            {/* Show "Add card" text or "Card added successfully" depending on the state */}
            {!cardAdded ? (
              <p onClick={handleClickOpen2}>
                Add card <i className="fa-regular fa-id-card"></i>
              </p>
            ) : (
              <div
                style={{
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                }}
              >
                <p>Card added successfully!</p>
                <i
                  className="fa-regular fa-eye"
                  onClick={handleViewClick}
                  style={{
                    marginLeft: "10px",
                    cursor: "pointer",
                    color: "blue",
                  }}
                ></i>
                <p
                  onClick={handleRemoveImage}
                  style={{
                    marginLeft: "10px",
                    cursor: "pointer",
                    color: "red",
                  }}
                >
                  Remove image
                </p>
              </div>
            )}

            {/* Popup for viewing the added card */}
            <Dialog open={showPopup} onClose={handleClosePopup}>
              <div className="popup">
                <div className="popup-content">
                  <span className="close" onClick={handleClosePopup}>
                    &times;
                  </span>
                  <h2>Card Details</h2>
                  {/* Show the card preview image if available */}
                  {previewUrl2 ? (
                    <img
                      src={previewUrl2}
                      alt="Card Preview"
                      style={{ width: "100%" }}
                    />
                  ) : (
                    <p>No card available</p>
                  )}
                </div>
              </div>
            </Dialog>
          </div>
          <div style={{ width: "100%", display: "flex", gap: "20px" }}>
            <div style={{ flexGrow: "1" }}>
              <Input
                type="date"
                value={formattedDate}
                onChange={handleDetailsChange_1}
                name="dob"
              />
            </div>
            <div style={{ flexGrow: "9" }}>
              <Select
                options={options}
                onChange={handleRatingchange}
                value={options.find(option => option.value === personInfo.rating)}
                name="rating"
              />
            </div>
          </div>
          <div>
            <Box>
              <Textarea
                placeholder="Short Description"
                name="shortdescription"
                minRows={2}
                maxRows={4}
                onChange={handleDetailsChange_1}
                value={personInfo.shortdescription}
              />
            </Box>
          </div>
          <div>
            <Input
              placeholder="Hashtags"
              name="hashtags"
              style={{ flexGrow: 1 }}
              value={personInfo.hashtags}
              onChange={handleDetailsChange_1}
            />
          </div>
          <p style={{ color: "green" }}>{error}</p>
          <div id="buttonContainer-flowchart-person">
            <button
              onClick={() => setPerson_1(false)}
              color="primary"
              id="discard-flowchart-person-new"
            >
              Discard
            </button>
            <button
              color="primary"
              id="save-flowchart-person-new"
              onClick={(event) => {
                event.preventDefault();
                handleSubmit(event);
                // CalculateProgress_Person();
                // setPerson_1(false);
              }}
            >
              Create Connection
            </button>
          </div>
        </div>
      </Dialog>
      <Subconnections
        open={person_2}
        onClose={() => setPerson_2(false)}
        connectionInfo={connectionInfo}
        handleSubconnections={handleSubconnections}
        handleSubconnectionsvalue={handleSubconnectionsvalue}
        fileInputRef={fileInputRef}
        fileInputRef2={fileInputRef2}
        imagePreview={imagePreview} // Pass your image preview source
        handleClickOpen={handleClickOpen}
        handleClickOpen2={handleClickOpen2}
        handleViewClick={handleViewClick}
        handleRemoveImage={handleRemoveImage}
        handleClosePopup={handleClosePopup}
        formattedDate={formattedDate}
        handleRatingchange={handleRatingchange}
        Profile={Profile} // Pass the profile image source
        error={error}
        handleFileChange={handleFileChange}
        handleFileChange2={handleFileChange2}
        // CalculateProgress_Person={CalculateProgress_Person}
      />
      {/* </Dialog> */}
    </div>
  );
};

export default ShowAddAccount;
