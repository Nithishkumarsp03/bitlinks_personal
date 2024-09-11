import React from 'react';
import { Dialog, Box } from '@mui/material';
import Textarea from "@mui/joy/Textarea";
import Input from '@mui/joy/Input';

const OutcomeDialog = ({ open, onClose, Outcomeinfo, handleDetailsChange6, error, handleOutcome,handleTotalValue, CalculateProgress_Outcome, CalculateTotal_Progress }) => {
  const formatDateForInput = (isoString) => {
    const date = new Date(isoString);
    const year = date.getFullYear();
    const month = (date.getMonth() + 1).toString().padStart(2, '0');
    const day = date.getDate().toString().padStart(2, '0');
    return `${year}-${month}-${day}`;
  };
  
  const formattedDate = formatDateForInput(Outcomeinfo.date);

  const handleKeyPress = (event) => {
    if (event.key === 'Enter') {
      event.preventDefault();  
      handleOutcome(event); 
      handleTotalValue(event); 
      CalculateProgress_Outcome();
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
          Previous Interactions
        </h3>
        <div style={{ display: "flex", gap: "15px" }}>
          <Input
            placeholder="Event Name"
            onChange={handleDetailsChange6}
            value={Outcomeinfo.eventname}
            name="eventname"
          />
          <Input
            type="date"
            className="time"
            onChange={handleDetailsChange6}
            value={formattedDate}
            name="date"
          />
        </div>
        <div>
          <Box>
            <Textarea
              placeholder="Outcome Description"
              minRows={2}
              maxRows={4}
              onChange={handleDetailsChange6}
              value={Outcomeinfo.description}
              name="description"
            />
          </Box>
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
              handleOutcome(event); 
              handleTotalValue(event); 
              CalculateProgress_Outcome();
              CalculateTotal_Progress();
            }}>
            Save changes
          </button>
        </div>
      </div>
    </Dialog>
  );
};

export default OutcomeDialog;
