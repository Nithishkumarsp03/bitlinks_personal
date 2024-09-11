import React from 'react';
import { Dialog, Box } from '@mui/material';
import Textarea from "@mui/joy/Textarea";
// import Profile from '../../Assets/Profile.png';
import Input from '@mui/joy/Input';

const Subconnections = ({
  open,
  onClose,
  connectionInfo,
  handleSubconnections, // This is now passed from the parent
  handleSubconnectionsvalue,
  // handlePerson,
  fileInputRef,
  imagePreview,
  handleClickOpen,
  Profile,
  error,
  handleFileChange,
  // CalculateProgress_Person,
}) => {

  const handleKeyPress = (event) => {
    if (event.key === 'Enter') {
      event.preventDefault();  
      handleSubconnections(event); 
      // CalculateProgress_Person();  
      // onClose();  
    }
  };

  return (
    <Dialog open={open} onClose={onClose} onKeyDown={handleKeyPress}>
      <div  
        className="dialogue"
        style={{
          gap: "15px",
          display: "flex",
          flexDirection: "column",
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
            />
            <div
              style={{
                border: "1px",
                borderRadius: "50px",
                width: "40px",
                height: "44px",
              }}
              onClick={handleClickOpen}>
              <img className="profilepic" src={imagePreview || Profile} />
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
          </div>
        <p style={{color: 'red'}}>{error}</p>
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
