import React, {useState, useEffect, useRef} from 'react';
import { Dialog, Box } from '@mui/material';
import Textarea from "@mui/joy/Textarea";
// import Profile from '../../Assets/Profile.png';
import Input from '@mui/joy/Input';
import Select from 'react-select';
import Profile from "../../Assets/Profile.png";
import Cookies from "js-cookie";
import CryptoJS from "crypto-js";
import CustomizedSwitches from '../../utils/Switch';
import { usePerson } from '../Context';

const SECRET_KEY = "your-secret-key";

const Subconnections = ({
  open,
  onClose,
}) => {

  const decrypt = (ciphertext) => {
    if (ciphertext) {
      const bytes = CryptoJS.AES.decrypt(ciphertext, SECRET_KEY);
      return bytes.toString(CryptoJS.enc.Utf8);
    }
    return "";
  };

  const handleKeyPress = (event) => {
    if (event.key === 'Enter') {
      event.preventDefault();  
      handleSubconnections(event); 
      // CalculateProgress_Person();  
      // onClose();  
    }
  };
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
    rank: "",
  });
  const email = decrypt(Cookies.get("email"));
  const token = decrypt(Cookies.get("token"));
  const [cardAdded, setCardAdded] = useState(false); 
  const [showPopup, setShowPopup] = useState(false);
  const [previewUrl2, setPreviewUrl2] = useState(null); 
  const [previewUrl1, setPreviewUrl1] = useState(null); 
  const fileInputRef = useRef(null);
  const fileInputRef2 = useRef(null);
  const [file, setFile] = useState(null); // For the first image
  const [file2, setFile2] = useState(null); // For the second image
  const [imagePreview, setImagePreview] = useState(Profile);
  const [SubCompletion, setSubCompletion] = useState(0);
  const [SubTotal_Progress, setSubTotal_Progress] = useState(0);
  const [error, setError] = useState('')
  const {selectedPersonId, subemail} = usePerson();
  const [checked, setChecked] = useState(false);
  // console.log("subemail: ",subemail);

  const handleSubconnectionsvalue = (e) => {
    const { name, value } = e.target;
    setConnectionInfo((prevDetails_1) => ({
      ...prevDetails_1,
      [name]: value,
    }));
  };

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
  }, [connectionInfo]);

  const handleSwitchChange = () => {
    setChecked((prevChecked) => {
      const newChecked = !prevChecked;
  
      // Update the 'spoc' field in personInfo based on new state
      setConnectionInfo((prevInfo) => ({
        ...prevInfo,
        rank: newChecked ? -1 : 0, // Set "yes" for true, "no" for false
      }));
  
      console.log("rank will be:", newChecked ? -1 : 0);
  
      return newChecked;
    });
  };

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

    if(subemail === ''){
      setError("Refferal Email is required to create a connection");
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

    if (file2) {
      const formData = new FormData();
      formData.append("file", file2);

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
        imagePath2 = uploadData.path;
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
            subemail,
            selectedPersonId,
            connectionInfo,
            imagePath1, // Only send imagePath if a file was uploaded
            imagePath2,
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

  const formattedDate = formatDateForInput(connectionInfo.dob.split("T")[0]);

  const handleRatingchange = (selectedOption) => {
    setConnectionInfo((prevDetails_1) => ({
      ...prevDetails_1,
      rating: selectedOption.value,  // Store the selected value
    }));
  }


  const options = [
    { label: "Higly Recommended", value: "Higly Recommended" },
    { label: "Recommended", value: "Recommended" },
    { label: "Not Recommended", value: "Not Recommended" },
  ];

  return (
    <Dialog open={open} onClose={onClose} onKeyDown={handleKeyPress}>
      <div  
        className="dialogue"
        style={{
          gap: "15px",
          display: "flex",
          flexDirection: "column",
          overflow: "auto",
        }}>
        <h3
          style={{
            fontSize: "25px",
            fontFamily: "Open Sans, sans-serif",
          }}>
          Personal Information
        </h3>
        <div className="1stline" style={{ display: "flex", gap: "15px" }}>
          <Input
            placeholder="Full Name"
            name="fullname"
            style={{ 
              flexGrow: 1, 
              borderWidth: '2px',
              borderStyle: 'solid',
            }}
            value={connectionInfo.fullname || ''}
            onChange={handleSubconnectionsvalue}  // Handle the change with the appropriate function
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
              onClick={handleClickOpen}>
              <img className="profilepic" src={previewUrl1 || Profile} />
            </div>
          </div>
        </div>
        <div className="2ndline" style={{ display: "flex", gap: "15px" }}>
          <Input
            placeholder="Phone Number"
            name="phonenumber"
            style={{
              borderWidth: '2px',
              borderStyle: 'solid',
            }}
            value={connectionInfo.phonenumber || ''}
            onChange={handleSubconnectionsvalue}  // Handle the change with the appropriate function
          />
          <Input
            placeholder="Age"
            name="age"
            type="number"
            value={connectionInfo.age || ''}
            onChange={handleSubconnectionsvalue}  // Handle the change with the appropriate function
          />
        </div>
        <div
          className="3rdline"
          style={{ display: "flex", gap: "15px", flex: "2" }}>
          <Input
            placeholder="Email"
            name="email"
            style={{ flexGrow: 1 }}
            value={connectionInfo.email || ''}
            onChange={handleSubconnectionsvalue}  // Handle the change with the appropriate function
          />
          <Input
            placeholder="Linkedin Url"
            name="linkedinurl"
            style={{ flexGrow: 1 }}
            value={connectionInfo.linkedinurl || ''}
            onChange={handleSubconnectionsvalue}  // Handle the change with the appropriate function
          />
        </div>
        <div>
          <Box>
            <Textarea
              placeholder="Address"
              name="address"
              minRows={2}
              maxRows={4}
              value={connectionInfo.address || ''}
              onChange={handleSubconnectionsvalue}  // Handle the change with the appropriate function
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
                onChange={handleSubconnectionsvalue}
                name="dob"
              />
            </div>
            <div style={{ flexGrow: "9" }}>
              <Select
                options={options}
                onChange={handleRatingchange}
                value={options.find(option => option.value === connectionInfo.rating)}
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
              value={connectionInfo.shortdescription || ''}
              onChange={handleSubconnectionsvalue}  // Handle the change with the appropriate function
            />
          </Box>
        </div>
        <div>
            <Input
                placeholder="Hashtags"
                name="hashtags"
                style={{ flexGrow: 1 }}
                value={connectionInfo.hashtags}
                onChange={handleSubconnectionsvalue}
            />
            <div id="spoc-input">
              Do you want to push this contact to rank 0{" "}
              <div onClick={handleSwitchChange}>
                <CustomizedSwitches checked={checked} />
              </div>{" "}
            </div>
          </div>

        <p style={{color: 'green'}}>{error}</p>
        <div id="buttonContainer-flowchart-person">
          <button
            onClick={onClose}
            color="primary"
            id="discard-flowchart-person">
            Discard
          </button>
          <button
            color="primary"
            id="save-flowchart-person"
            onClick={(e) => {
              e.preventDefault();  
              handleSubconnections(e); 
              // CalculateProgress_Person();
            }}>
            Save changes
          </button>
        </div>
      </div>
    </Dialog>
  );
};

export default Subconnections;
