import React from 'react';
import { Dialog, Box } from '@mui/material';
import Input from '@mui/joy/Input';
import RoleDropdown from '../../Dropdown/RoleDropdown';
import CompanyDropdown from '../../Dropdown/CompanyDropdown';
import AddressDropdown from '../../Dropdown/AddressDropdown';

const PreviousExperienceDialog = ({
  open,
  onClose,
  Ifexperience,
  setIfexperience,
  PreviousExperienceinfo,
  handleDetailsChange2,
  error,
  handleExperience,
  handleTotalValue,
  CalculateProgress_Experience,
  CalculateTotal_Progress
}) => {

  const handleRoleChange = (newRole) => {
    handleDetailsChange2({ target: { name: 'role', value: newRole } });
  };

  const handleKeyPress = (event) => {
    if (event.key === 'Enter') {
      event.preventDefault();
      handleExperience(event);
      handleTotalValue(event);
      CalculateProgress_Experience();
      CalculateTotal_Progress();
    }
  };

  return (
    <Dialog
      open={open}
      onClose={onClose}
      onKeyDown={handleKeyPress}
    >
      <div
        className="dialogue"
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
          Previous Interactions
        </h3>

        <div style={{ display: "flex", gap: "15px" }}>
          <label>
            <input
              type="radio"
              name="experience"
              value="yes"
              checked={Ifexperience === "yes"}
              onChange={(e) => setIfexperience(e.target.value)}
            />
            Yes, Have a previous Experience
          </label>
          <label>
            <input
              type="radio"
              name="experience"
              value="no"
              checked={Ifexperience === "no"}
              onChange={(e) => setIfexperience(e.target.value)}
            />
            No previous Experience
          </label>
        </div>

        {Ifexperience === "yes" && (
          <div
            style={{
              display: "flex",
              flexDirection: "column",
              gap: "15px",
            }}
          >
            <div style={{ display: "flex",flexDirection: "column", gap: "15px" ,width: "100%"}}>
              <CompanyDropdown
                value={PreviousExperienceinfo.companyname}
                onChange={(newCompany) => handleDetailsChange2({ target: { name: 'companyname', value: newCompany } })}
              />
               <div style={{ display: "flex", gap: "7%" ,width: "100%"}}>
              <Input
              style={{width: "100%  "}}
                placeholder="Position"
                onChange={handleDetailsChange2}
                value={PreviousExperienceinfo.position}
                name="position"
              />
               <Input
              style={{width: "100%  "}}
                placeholder="Experience in (Yrs)"
                onChange={handleDetailsChange2}
                value={PreviousExperienceinfo.experience}
                type='number'
                name="experience"
              />
            </div>

           
             <div style={{width: "100%"}}>
              <RoleDropdown
                value={PreviousExperienceinfo.role}
                onChange={handleRoleChange}
              />
              </div>
            </div>

            <div>
              <Box>
                <AddressDropdown
                  value={PreviousExperienceinfo.companyaddress}
                  onChange={(newAddress) => handleDetailsChange2({ target: { name: 'companyaddress', value: newAddress } })}
                />
              </Box>
            </div>
          </div>
        )}

        <p style={{ color: 'green' }}>{error}</p>

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
              event.preventDefault();
              handleExperience(event);
              handleTotalValue(event);
              CalculateProgress_Experience();
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

export default PreviousExperienceDialog;