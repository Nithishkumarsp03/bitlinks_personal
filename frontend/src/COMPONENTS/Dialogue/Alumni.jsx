import React from 'react';
import { Dialog, Box } from '@mui/material';
import Textarea from "@mui/joy/Textarea";
import Input from '@mui/joy/Input';
import AddressDropdown from './AddressDropdown';

const AlumniDialog = ({ open, onClose, Alumniinfo, handleDetailsChange5, error, handleAlumni,handleTotalValue, CalculateProgress_Alumni, CalculateTotal_Progress }) => {
  
  const handleAddressChange = (newAddress) => {
    handleDetailsChange5({ target: { name: 'companyaddress', value: newAddress } });
  };

  const handleAddressTextChange = (newText) => {
    handleDetailsChange5({ target: { name: 'companyaddress', value: newText } });
  };

  // const [alumniinfo, setAlumniinfo] = useState({ companyname: '' });

  const handleKeyPress = (event) => {
    if (event.key === 'Enter') {
      event.preventDefault();  
      handleAlumni(event); 
      handleTotalValue(event); 
      CalculateProgress_Alumni();
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
          Alumni Details
        </h3>
        <div style={{ display: "flex", gap: "15px" }}>
          <Input
            placeholder="Name"
            onChange={handleDetailsChange5}
            value={Alumniinfo.name}
            name="name"
          />
          <Input
            placeholder="Batch"
            onChange={handleDetailsChange5}
            value={Alumniinfo.batch}
            name="batch"
          />
        </div>
        <div style={{ display: "flex", gap: "15px" }}>
          <Input
            placeholder="Graduated Year"
            onChange={handleDetailsChange5}
            value={Alumniinfo.graduatedyear}
            name="graduatedyear"
          />
          <Input
            placeholder="Phone number"
            onChange={handleDetailsChange5}
            value={Alumniinfo.phonenumber}
            name="phonenumber"
          />
        </div>
        <div>
          <Box>
            {/* <Textarea
              placeholder="Company Address"
              minRows={2}
              maxRows={4}
              onChange={handleDetailsChange5}
              value={Alumniinfo.companyaddress}
              name="companyaddress"
            /> */}
            <AddressDropdown
              value={Alumniinfo.companyaddress}
              onChange={(newAddress) => handleDetailsChange5({ target: { name: 'companyaddress', value: newAddress } })}
            />
          </Box>
        </div>
        <p style={{ color: 'green' }}>{error}</p>
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
              handleAlumni(event); 
              handleTotalValue(event); 
              CalculateProgress_Alumni();
              CalculateTotal_Progress();
            }}>
            Save changes
          </button>
        </div>
      </div>
    </Dialog>
  );
};

export default AlumniDialog;
