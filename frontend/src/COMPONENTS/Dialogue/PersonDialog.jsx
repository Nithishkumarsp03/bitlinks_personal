import React from "react";
import { useState, useRef, useEffect } from "react";
import Select from "react-select";
import { Dialog, Box } from "@mui/material";
import Textarea from "@mui/joy/Textarea";
import Input from "@mui/joy/Input";
import { usePerson } from "../Context";
import Cookies from "js-cookie";
import CryptoJS from "crypto-js";
import Profile from "../../Assets/Profile.png";
import CustomizedSwitches from "../../utils/Switch";

const SECRET_KEY = "your-secret-key";

const PersonDialog = ({
  open,
  onClose,
  personFilledFields,
  experienceFilledFields,
  companyFilledFields,
  placementFilledFields,
  consultancyFilledFields,
  internshipFilledFields,
  alumniFilledFields,
  outcomeFilledFields,
  CalculateProgress_Person,
  handleTotalValue,
  handleDetailsChangeonly1
}) => {
  const decrypt = (ciphertext) => {
    if (ciphertext) {
      const bytes = CryptoJS.AES.decrypt(ciphertext, SECRET_KEY);
      return bytes.toString(CryptoJS.enc.Utf8);
    }
    return "";
  };

  const [personInfo, setPersoninfo] = useState({
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
    Completion: "",
    hashtags: "",
    rank: "",
  });
  // console.log("Rank is: ",personInfo.rank);
  const token = decrypt(Cookies.get("token"));
  const [Completion, setCompletion] = useState(0);
  const [Progress, setProgress] = useState(0);
  const [Person_Progress, setPerson_Progress] = useState(0);
  const { selectedPersonId } = usePerson();
  const [file, setFile] = useState(null); // For the first image
  const [file2, setFile2] = useState(null); // For the second image
  const [imagePreview, setImagePreview] = useState(Profile);
  const [imagePreview2, setImagePreview2] = useState(null);
  const [error, setError] = useState("");
  const [Total_Progress, setTotal_Progress] = useState(0);
  const [previewUrl1, setPreviewUrl1] = useState(null);
  const [previewUrl2, setPreviewUrl2] = useState(null);
  const [cardAdded, setCardAdded] = useState(false);
  const [checked, setChecked] = useState(false);
  const fileInputRef = useRef(null);
  const fileInputRef2 = useRef(null);

  const handleDetailsChange1 = (e) => {
    const { name, value } = e.target;
    setPersoninfo((prevDetails) => ({
      ...prevDetails,
      [name]: value,
    }));
    handleDetailsChangeonly1(e); 
  };

  const handleFileChange = (e) => {
    const selectedFile = e.target.files[0];
    setFile(selectedFile);

    if (selectedFile) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setImagePreview(reader.result);
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

  const handleSwitchChange = () => {
    setChecked((prevChecked) => {
      const newChecked = !prevChecked;
  
      // Update the 'spoc' field in personInfo based on new state
      setPersoninfo((prevInfo) => ({
        ...prevInfo,
        rank: newChecked ? 0 : -1, // Set "yes" for true, "no" for false
      }));
  
      console.log("rank will be:", newChecked ? 0 : -1);
  
      return newChecked;
    });
  };

  const handleClickOpen2 = () => {
    // console.log("clicked");
    if (fileInputRef2.current) {
      fileInputRef2.current.click();
    }
  };
  const handleClickOpen = () => {
    if (fileInputRef.current) {
      fileInputRef.current.click();
    }
  };
  const handleViewClick = () => {
    setShowPopup(true);
  };
  const handleRemoveImage = () => {
    setFile2(null); // Clear the selected file
    setPreviewUrl2(null); // Clear the preview URL
    setCardAdded(false); // Reset the card added state
    setImagePreview2(null);
  };
  const handleRatingchange = (selectedOption) => {
    if (selectedOption) {
      // Update the personInfo state with the selected rating
      setPersoninfo((prevDetails) => ({
        ...prevDetails,
        rating: selectedOption.value, // Set the rating value
      }));
  
      // Call handleDetailsChange1 with an object mimicking an event
      handleDetailsChange1({
        target: {
          name: 'rating', // Specify the name of the field
          value: selectedOption.value, // Use the selected option's value
        },
      });
    }
  };
  
  // const CalculateProgress_Person = () => {
  //   const {
  //     fullname,
  //     phonenumber,
  //     age,
  //     email,
  //     dob,
  //     rating,
  //     linkedinurl,
  //     address,
  //     shortdescription,
  //     hashtags,
  //   } = personInfo;

  //   const totalFields = 10;

  //   // if (totalFields === 0)

  //   const filledFields =
  //     (typeof fullname === "string" && fullname.trim() !== "" ? 1 : 0) +
  //     (typeof phonenumber === "string" && phonenumber.trim() !== "" ? 1 : 0) +
  //     (age.trim() !== "" ? 1 : 0) +
  //     (typeof email === "string" && email.trim() !== "" ? 1 : 0) +
  //     (typeof dob === "string" && dob.trim() !== "" ? 1 : 0) +
  //     (typeof rating === "string" && rating.trim() !== "" ? 1 : 0) +
  //     (typeof linkedinurl === "string" && linkedinurl.trim() !== "" ? 1 : 0) +
  //     (typeof address === "string" && address.trim() !== "" ? 1 : 0) +
  //     (typeof shortdescription === "string" && shortdescription.trim() !== ""
  //       ? 1
  //       : 0) +
  //     (typeof hashtags === "string" && hashtags.trim() !== "" ? 1 : 0);

  //   // Object.values(personInfo).filter(
  //   //   (value) => value !== ""
  //   // ).length;
  //   const Completion = (filledFields / totalFields) * 100;
  //   setCompletion(Completion);
  //   setPerson_Progress(Completion);

  //   // console.log("filledFields : ",filledFields);
  //   // console.log("totalFields : ",totalFields);
  //   // console.log("Completion : ",Completion);
  // };
  useEffect(() => {
    if (!selectedPersonId) return;
    const fetchPerson = async () => {
      try {
        const personResponse = await fetch(
          process.env.REACT_APP_API + `/persondata/${selectedPersonId}`,
          {
            method: "GET",
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${token}`,
            },
          }
        );
        if (!personResponse.ok) {
          throw new Error(`HTTP error! status: ${personResponse.status}`);
        }
        const data = await personResponse.json();
        // console.log(data);
        setPersoninfo(data);
        setPerson_Progress(data.Completion);
        // console.log(data.rank);
        // setIfperson(data.ifperson);
        setImagePreview(`${process.env.REACT_APP_API}${data.profile}`);
        // console.log("visitingcard:",data.visitingcard);
        setImagePreview2(`${process.env.REACT_APP_API}${data.visitingcard}`);
        // console.log('Rank:', data.rank, 'Type:', typeof data.rank);
        if (data.visitingcard) {
          setCardAdded(true);
        }
        // setCardAdded(`${process.env.REACT_APP_API}${data.visitingcard}`)
      } catch (error) {
        setError(error.message);
      }
    };
    fetchPerson();
  }, [selectedPersonId]);

  // console.log("rating:",personInfo.rating)

  const handlePerson = async (e) => {
    e.preventDefault();

    let imagePath1 = null;
    let imagePath2 = null;

    if (file) {
      const formData = new FormData();
      formData.append("file", file);

      try {
        const uploadResponse = await fetch(
          process.env.REACT_APP_API + "/upload",
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
        // console.log("Image path: ", uploadData.path);
        imagePath1 = uploadData.path; // Store the image path in imagePreview
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
          process.env.REACT_APP_API + "/upload",
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
        // console.log("Image path: ", uploadData.path);
        imagePath2 = uploadData.path; // Store the image path in imagePreview
      } catch (error) {
        console.error("Error:", error);
        setError("An error occurred during file upload. Please try again.");
        return;
      }
    }

    try {
      // Construct the body of the request conditionally
      const requestBody = {
        selectedPersonId,
        personInfo: {
          ...personInfo,
          rating: personInfo.rating,
        },
        imagePath1,
        imagePath2,
        Completion,
        TotalProgress: Total_Progress,
      };

      const response = await fetch(
        process.env.REACT_APP_API + "/personupload",
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify(requestBody),
        }
      );

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();
      setError("Updated the latest changes");
    } catch (error) {
      setError(error.message);
    }
  };

  const CalculateTotal_Progress = () => {
    const completion =
      // Person_Progress +
      personFilledFields +
      experienceFilledFields +
      companyFilledFields +
      placementFilledFields +
      consultancyFilledFields +
      internshipFilledFields +
      alumniFilledFields +
      outcomeFilledFields;
    setTotal_Progress(completion);
  };

  useEffect(() => {
    CalculateProgress_Person();
    CalculateTotal_Progress();
  }, [personInfo]);

  const formatDateForInput = (isoString) => {
    const date = new Date(isoString);
    const year = date.getFullYear();
    const month = (date.getMonth() + 1).toString().padStart(2, "0");
    const day = date.getDate().toString().padStart(2, "0");
    return `${year}-${month}-${day}`;
  };

  const formattedDate = formatDateForInput(personInfo.dob.split("T")[0]);

  // const formattedDate = formatDateForInput(personInfo.dob);

  const [showPopup, setShowPopup] = useState(false);
  const options = [
    { label: "Highly Recommended", value: "Highly Recommended" },
    { label: "Recommended", value: "Recommended" },
    { label: "Not Recommended", value: "Not Recommended" },
  ];

  const handleClosePopup = () => {
    setShowPopup(false);
  };

  const handleKeyPress = (event) => {
    if (event.key === 'Enter') {
      event.preventDefault();
      handlePerson(event);
      handleTotalValue(event);
      CalculateProgress_Person();
      CalculateTotal_Progress();
    }
  };

  return (
    <Dialog open={open} onClose={onClose} onKeyDown={handleKeyPress}>
      <div
        className="dialogue-addaccount"
        style={{
          gap: "15px",
          display: "flex",
          flexDirection: "column",
          overflow: "auto",
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
            style={{
              flexGrow: 1,
              borderWidth: "2px",
              borderStyle: "solid",
            }}
            value={personInfo.fullname || ""}
            onChange={(e) => handleDetailsChange1(e)}
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
              <img className="profilepic" src={imagePreview || Profile} />
            </div>
          </div>
        </div>
        <div className="2ndline" style={{ display: "flex", gap: "15px" }}>
          <Input
            placeholder="Phone Number"
            name="phonenumber"
            style={{
              borderWidth: "2px",
              borderStyle: "solid",
            }}
            value={personInfo.phonenumber || ""}
            onChange={handleDetailsChange1}
          />
          <Input
            placeholder="Age"
            name="age"
            type="number"
            value={personInfo.age || ""}
            onChange={handleDetailsChange1}
          />
        </div>
        <div
          className="3rdline"
          style={{ display: "flex", gap: "15px", flex: "2" }}
        >
          <Input
            placeholder="Email"
            name="email"
            style={{ flexGrow: 1 }}
            value={personInfo.email || ""}
            onChange={handleDetailsChange1}
          />
          <Input
            placeholder="Linkedin Url"
            name="linkedinurl"
            style={{ flexGrow: 1 }}
            value={personInfo.linkedinurl || ""}
            onChange={handleDetailsChange1}
          />
        </div>
        <div>
          <Box>
            <Textarea
              placeholder="Address"
              name="address"
              minRows={2}
              maxRows={4}
              value={personInfo.address || ""}
              onChange={handleDetailsChange1}
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
            // value={personInfo.visitingcard || ''}
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
                {/* <h2>Card Details</h2> */}
                {/* Show the card preview image if available */}
                {imagePreview2 ? (
                  <img
                    src={imagePreview2}
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
              onChange={handleDetailsChange1}
              name="dob"
            />
          </div>
          <div style={{ flexGrow: "9" }}>
            <Select
              options={options}
              onChange={handleRatingchange}
              value={options.find(
                (option) => option.value === personInfo.rating
              )}
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
              value={personInfo.shortdescription || ""}
              onChange={handleDetailsChange1}
            />
          </Box>
        </div>
        <div>
          <Input
            placeholder="Hashtags"
            name="hashtags"
            style={{ flexGrow: 1 }}
            value={personInfo.hashtags}
            onChange={handleDetailsChange1}
          />
          {personInfo.rank === -1 ? 
          <div id="spoc-input">
          Still you didn't make any interactions with {personInfo.fullname}. Please turn on to start interaction
          <div onClick={handleSwitchChange}>
            <CustomizedSwitches checked={checked} />
          </div>{" "}
        </div> : personInfo.rank >= 0 ? <div id="spoc-input">
          Turn off to hold interactions with {personInfo.fullname}.   
          <div onClick={handleSwitchChange}>
            <CustomizedSwitches checked={true} />
          </div>{" "}
        </div> :""}
        </div>
        <p style={{ color: "green" }}>{error}</p>
        <div id="buttonContainer-flowchart-person">
          <button
            onClick={onClose}
            color="primary"
            id="discard-flowchart-person"
          >
            Discard
          </button>
          <button
            color="primary"
            id="save-flowchart-person"
            onClick={(event) => {
              event.preventDefault(); // Prevent default behavior if necessary
              handlePerson(event);
              handleTotalValue(event);
              CalculateProgress_Person();
              CalculateTotal_Progress();
            }}
          >
            Save changes
          </button>
        </div>
      </div>
    </Dialog>
  );
};

export default PersonDialog;
