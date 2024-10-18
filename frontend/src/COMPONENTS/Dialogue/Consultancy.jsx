import React, { useState, useEffect } from 'react';
import { Dialog } from '@mui/material';
import Input from '@mui/joy/Input';
import DomainDropdown from '../../Dropdown/DomainDropdown';
import RoleDropdown from '../../Dropdown/RoleDropdown';
import SkillsetDropdown from '../../Dropdown/SkillsetDropdown';

const ConsultancyDialog = ({
  open, 
  onClose, 
  Ifconsultancy, 
  setIfconsultancy, 
  Consultancyinfo, 
  handleDetailsChange9, 
  error, 
  handleConsultancy, 
  handleTotalValue, 
  CalculateProgress_Consultancy,
  CalculateTotal_Progress
}) => {
  
  const [consultancyInfo, setConsultancyInfo] = useState({ 
    domain: Consultancyinfo.domain || '',
    role: Consultancyinfo.role || '',
    skillset: Array.isArray(Consultancyinfo.skillset) ? Consultancyinfo.skillset : [],
    eligibility: Consultancyinfo.eligibility || '',
    projecttype: Consultancyinfo.projecttype || ''
  });

  useEffect(() => {
    // Update local state whenever Consultancyinfo changes
    setConsultancyInfo({
      domain: Consultancyinfo.domain || '',
      role: Consultancyinfo.role || '',
      skillset: Array.isArray(Consultancyinfo.skillset) ? Consultancyinfo.skillset : [],
      eligibility: Consultancyinfo.eligibility || '',
      projecttype: Consultancyinfo.projecttype || ''
    });
  }, [Consultancyinfo]);

  // Handle changes for Role Dropdown
  const handleRoleChange = (newRole) => {
    setConsultancyInfo(prev => ({ ...prev, role: newRole }));
    handleDetailsChange9({ target: { name: 'role', value: newRole } });
  };

  const handleRoleTextChange = (newText) => {
    setConsultancyInfo(prev => ({ ...prev, role: newText }));
    handleDetailsChange9({ target: { name: 'role', value: newText } });
  };

  // Handle changes for Domain Dropdown
  const handleDomainChange = (newDomain) => {
    setConsultancyInfo(prev => ({ ...prev, domain: newDomain }));
    handleDetailsChange9({ target: { name: 'domain', value: newDomain } });
  };

  const handleDomainTextChange = (newText) => {
    setConsultancyInfo(prev => ({ ...prev, domain: newText }));
    handleDetailsChange9({ target: { name: 'domain', value: newText } });
  };

  // Handle changes for Skillset Dropdown
  const handleSkillsetChange = (newSkillset) => {
    setConsultancyInfo(prev => ({ ...prev, skillset: newSkillset }));
    handleDetailsChange9({ target: { name: 'skillset', value: newSkillset } });
  };

  const handleSkillsetTextChange = (newText) => {
    setConsultancyInfo(prev => ({ ...prev, skillset: newText }));
    handleDetailsChange9({ target: { name: 'skillset', value: newText } });
  };

  // Save consultancy info and call the appropriate functions
  const saveConsultancyInfo = (event) => {
    event.preventDefault(); // Prevent default behavior if necessary

    handleDetailsChange9({ target: { name: 'domain', value: consultancyInfo.domain } });
    handleDetailsChange9({ target: { name: 'role', value: consultancyInfo.role } });
    handleDetailsChange9({ target: { name: 'skillset', value: consultancyInfo.skillset  } });
    handleDetailsChange9({ target: { name: 'eligibility', value: consultancyInfo.eligibility } });
    handleDetailsChange9({ target: { name: 'projecttype', value: consultancyInfo.projecttype } });

    handleConsultancy(event);
    handleTotalValue(event); 
    CalculateProgress_Consultancy();
    CalculateTotal_Progress();
    onClose();
  };

  // Handle keypress for Enter key
  const handleKeyPress = (event) => {
    if (event.key === 'Enter') {
      event.preventDefault();  
      saveConsultancyInfo(event);
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
          overflow: "auto",
        }}>
        <h3
          style={{
            fontSize: "25px",
            fontFamily: "Open Sans, sans-serif",
          }}>
          Consultancy
        </h3>
        <div style={{ display: "flex", gap: "15px" }}>
          <label>
            <input
              type="radio"
              name="consultancy"
              value="yes"
              checked={Ifconsultancy === "yes"}
              onChange={(e) => setIfconsultancy(e.target.value)}
            />
            Yes, Have Project Opportunities
          </label>
          <label>
            <input
              type="radio"
              name="consultancy"
              value="no"
              checked={Ifconsultancy === "no"}
              onChange={(e) => setIfconsultancy(e.target.value)}
            />
            No, Don't Have Project Opportunities
          </label>
        </div>
        <div>
          {Ifconsultancy === "yes" && (
            <div
              style={{
                display: "flex",
                flexDirection: "column",
                gap: "15px",
              }}>
              <div style={{ display: "flex", gap: "15px" }}>
                <div style={{width:'50%'}}>
                <RoleDropdown
                  value={consultancyInfo.role}
                  onChange={handleRoleChange}
                  onTextChange={handleRoleTextChange}
                />
                </div>
                <div style={{width:'50%'}}>
                <DomainDropdown
                    value={consultancyInfo.domain}
                    onChange={handleDomainChange}
                    onTextChange={handleDomainTextChange}
                />
                </div>
              </div>
              <div style={{ display: "flex", gap: "15px" }}>
                <SkillsetDropdown
                  style={{ flexGrow: '2' }}
                  value={consultancyInfo.skillset}
                  onChange={handleSkillsetChange}
                  onTextChange={handleSkillsetTextChange}
                />
                <Input
                  placeholder="Eligibility"
                  style={{ flexGrow: "1" }}
                  onChange={(e) => handleDetailsChange9(e)}
                  value={consultancyInfo.eligibility}
                  name="eligibility"
                />
              </div>
              <div>
                <Input
                  placeholder="Project Type - Eg: Freelance, Project, MiniProject"
                  style={{ flexGrow: "1" }}
                  onChange={(e) => handleDetailsChange9(e)}
                  value={consultancyInfo.projecttype}
                  name="projecttype"
                />
              </div>
            </div>
          )}
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
            onClick={saveConsultancyInfo}>
            Save changes
          </button>
        </div>
      </div>
    </Dialog>
  );
};

export default ConsultancyDialog;