import React from 'react';
import { Dialog, Box } from '@mui/material';
import Input from '@mui/joy/Input';
import RoleDropdown from '../../Dropdown/RoleDropdown';
import DomainDropdown from '../../Dropdown/DomainDropdown';
import SkillsetDropdown from '../../Dropdown/SkillsetDropdown';

const InternshipDialog = ({
  open, 
  onClose, 
  Ifinternship, 
  setIfinternship, 
  Internshipinfo, 
  handleDetailsChange10, 
  error, 
  handleInternship, 
  handleTotalValue, 
  CalculateProgress_Internship,
  CalculateTotal_Progress
}) => {

  const handleKeyPress = (event) => {
    if (event.key === 'Enter') {
      event.preventDefault();  
      handleInternship(event); 
      handleTotalValue(event); 
      CalculateProgress_Internship();
      CalculateTotal_Progress();
    }
  };

  const handleRoleChange = (newRole) => {
    // console.log('Role changed to:', newRole); // Debug log
    handleDetailsChange10({ target: { name: 'role', value: newRole } });
  };

  const handleRoleTextChange = (newText) => {
    // console.log('Role text changed to:', newText);
    handleDetailsChange10({ target: { name: 'role', value: newText } });
  };

  const handleDomainChange = (newDomain) => {
    handleDetailsChange10({ target: { name: 'domain', value: newDomain } });
  };

  const handleDomainTextChange = (newText) => {
    handleDetailsChange10({ target: { name: 'domain', value: newText } });
  };

  const handleSkillsetChange = (newSkillset) => {
    handleDetailsChange10({ target: { name: 'skillset', value: newSkillset } });
  };

  const handleSkillsetTextChange = (newText) => {
    handleDetailsChange10({ target: { name: 'skillset', value: newText } });
  };

  return (
    <Dialog open={open} onClose={onClose} onKeyDown={handleKeyPress}>
      <Box
        className="dialogue"
        sx={{
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
          Internship
        </h3>
        <Box sx={{ display: "flex", gap: "15px" }}>
          <label>
            <input
              type="radio"
              name="internship"
              value="yes"
              checked={Ifinternship === "yes"}
              onChange={(e) => setIfinternship(e.target.value)}
            />
            Yes, Have Internship Opportunities
          </label>
          <label>
            <input
              type="radio"
              name="internship"
              value="no"
              checked={Ifinternship === "no"}
              onChange={(e) => setIfinternship(e.target.value)}
            />
            No, Don't Have Internship Opportunities
          </label>
        </Box>
        {Ifinternship === "yes" && (
          <Box sx={{ display: "flex", flexDirection: "column", gap: "15px" }}>
              <RoleDropdown
                value={Internshipinfo.role || ''} // Ensure default value
                onChange={handleRoleChange}
                onTextChange={handleRoleTextChange}
              />
              <DomainDropdown
                value={Internshipinfo.domain || ''} // Ensure default value
                onChange={handleDomainChange}
                onTextChange={handleDomainTextChange}
              />
            <Box >
              <SkillsetDropdown
                sx={{ flexGrow: '2' }}
                value={Internshipinfo.skillset || ''} // Ensure default value
                onChange={handleSkillsetChange}
                onTextChange={handleSkillsetTextChange}
              />
              
            </Box>
            <Box sx={{ display: "flex", gap: "15px" }}>
            <Input
                placeholder="Eligibility"
                sx={{ flexGrow: "1" }}
                onChange={handleDetailsChange10}
                value={Internshipinfo.eligibility || ''} // Ensure default value
                name="eligibility"
              />
              <Input
                placeholder="Project Type - Eg: Freelance, Project, MiniProject"
                sx={{ flexGrow: "1" }}
                onChange={handleDetailsChange10}
                value={Internshipinfo.projecttype || ''} // Ensure default value
                name="projecttype"
              />
            </Box>
          </Box>
        )}
        <p style={{ color: 'green' }}>{error}</p>
        <Box id="buttonContainer-flowchart-person" sx={{ display: "flex", justifyContent: "space-between" }}>
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
              event.preventDefault();
              handleInternship(event); 
              handleTotalValue(event); 
              CalculateProgress_Internship();
              CalculateTotal_Progress();
            }}>
            Save changes
          </button>
        </Box>
      </Box>
    </Dialog>
  );
};

export default InternshipDialog;