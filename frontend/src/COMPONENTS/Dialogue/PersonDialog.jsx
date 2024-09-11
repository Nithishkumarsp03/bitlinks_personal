import React from 'react';
import { useState, useRef } from "react";
import { Dialog, Box } from '@mui/material';
import Textarea from "@mui/joy/Textarea";
import Input from '@mui/joy/Input';

const PersonDialog = ({ open, onClose, personInfo, handleDetailsChange1, handlePerson, fileInputRef, imagePreview, handleClickOpen, Profile, error, handleFileChange, handleTotalValue , CalculateProgress_Person, CalculateTotal_Progress }) => {


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
            value={personInfo.fullname || ''}
            onChange={handleDetailsChange1}
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
            value={personInfo.phonenumber || ''}
            onChange={handleDetailsChange1}
          />
          <Input
            placeholder="Age"
            name="age"
            type="number"
            value={personInfo.age || ''}
            onChange={handleDetailsChange1}
          />
        </div>
        <div
          className="3rdline"
          style={{ display: "flex", gap: "15px", flex: "2" }}>
          <Input
            placeholder="Email"
            name="email"
            style={{ flexGrow: 1 }}
            value={personInfo.email || ''}
            onChange={handleDetailsChange1}
          />
          <Input
            placeholder="Linkedin Url"
            name="linkedinurl"
            style={{ flexGrow: 1 }}
            value={personInfo.linkedinurl || ''}
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
              value={personInfo.address || ''}
              onChange={handleDetailsChange1}
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
              value={personInfo.shortdescription || ''}
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
            onClick={(event) => {
              event.preventDefault();  // Prevent default behavior if necessary
              handlePerson(event); 
              handleTotalValue(event); 
              CalculateProgress_Person();
              CalculateTotal_Progress();
            }}>
            Save changes
          </button>
        </div>
      </div>
    </Dialog>
  );
};

export default PersonDialog;
