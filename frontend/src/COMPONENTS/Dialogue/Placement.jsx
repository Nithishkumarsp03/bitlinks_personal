import React, { useState, useEffect } from 'react';
import { Dialog } from '@mui/material';
import Input from '@mui/joy/Input';
import RoleDropdown from '../../Dropdown/RoleDropdown';
import DomainDropdown from '../../Dropdown/DomainDropdown';
import SkillsetDropdown from '../../Dropdown/SkillsetDropdown';

const PlacementDialog = ({
  open, 
  onClose, 
  Ifplacement, 
  setIfplacement, 
  Placementinfo, 
  handleDetailsChange8, 
  error, 
  handlePlacement, 
  handleTotalValue,
  CalculateProgress_Placement,
  CalculateTotal_Progress,
}) => {
  
  const [placementInfo, setPlacementInfo] = useState({ 
    domain: Placementinfo.domain || '',
    role: Placementinfo.role || '',
    skillset: Placementinfo.skillset || '',
    eligibility: Placementinfo.eligibility || ''
  });

  useEffect(() => {
    // Update local state whenever Placementinfo changes
    setPlacementInfo({
      domain: Placementinfo.domain || '',
      role: Placementinfo.role || '',
      skillset: Placementinfo.skillset || '',
      eligibility: Placementinfo.eligibility || ''
    });
  }, [Placementinfo]);

  // Handle changes for Role Dropdown
  const handleRoleChange = (newRole) => {
    setPlacementInfo(prev => ({ ...prev, role: newRole }));
    handleDetailsChange8({ target: { name: 'role', value: newRole } });
  };

  const handleRoleTextChange = (newText) => {
    setPlacementInfo(prev => ({ ...prev, role: newText }));
    handleDetailsChange8({ target: { name: 'role', value: newText } });
  };

  // Handle changes for Domain Dropdown
  const handleDomainChange = (newDomain) => {
    setPlacementInfo(prev => ({ ...prev, domain: newDomain }));
    handleDetailsChange8({ target: { name: 'domain', value: newDomain } });
  };

  const handleDomainTextChange = (newText) => {
    setPlacementInfo(prev => ({ ...prev, domain: newText }));
    handleDetailsChange8({ target: { name: 'domain', value: newText } });
  };

  // Handle changes for Skillset Dropdown
  const handleSkillsetChange = (newSkillset) => {
    // Ensure newSkillset is a non-null string
    const safeSkillset = newSkillset || "";
  
    // Update state with the safe skillset value
    setPlacementInfo(prev => ({ ...prev, skillset: safeSkillset }));
  
    // Pass the safe skillset value to handleDetailsChange8
    handleDetailsChange8({ target: { name: 'skillset', value: safeSkillset } });
  };
  

  const handleSkillsetTextChange = (newText) => {
    setPlacementInfo(prev => ({ ...prev, skillset: newText }));
    handleDetailsChange8({ target: { name: 'skillset', value: newText } });
  };

  // Save placement info and call the appropriate functions
  const savePlacementInfo = (event) => {
    event.preventDefault(); // Prevent default behavior if necessary

    handleDetailsChange8({ target: { name: 'domain', value: placementInfo.domain } });
    handleDetailsChange8({ target: { name: 'role', value: placementInfo.role } });
    handleDetailsChange8({ target: { name: 'skillset', value: placementInfo.skillset } });
    handleDetailsChange8({ target: { name: 'eligibility', value: placementInfo.eligibility } });

    handlePlacement(event);
    handleTotalValue(event); 
    CalculateProgress_Placement();
    CalculateTotal_Progress();
    onClose();
  };

  // Handle keypress for Enter key
  const handleKeyPress = (event) => {
    if (event.key === 'Enter') {
      event.preventDefault();  
      savePlacementInfo(event);
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
          Placement
        </h3>
        <div style={{ display: "flex", gap: "15px" }}>
          <label>
            <input
              type="radio"
              name="placement"
              value="yes"
              checked={Ifplacement === "yes"}
              onChange={(e) => setIfplacement(e.target.value)}
            />
            Yes, Have Placement Opportunities
          </label>
          <label>
            <input
              type="radio"
              name="placement"
              value="no"
              checked={Ifplacement === "no"}
              onChange={(e) => setIfplacement(e.target.value)}
            />
            No, Don't Have Placement Opportunities
          </label>
        </div>
        <div>
          {Ifplacement === "yes" && (
            <div
              style={{
                display: "flex",
                flexDirection: "column",
                gap: "15px",
              }}>
              <div style={{ display: "flex", gap: "15px" }}>
                <RoleDropdown
                  value={placementInfo.role}
                  onChange={handleRoleChange}
                  onTextChange={handleRoleTextChange}
                />
                
              </div>
              <div>
              <DomainDropdown
                    value={placementInfo.domain}
                    onChange={handleDomainChange}
                    onTextChange={handleDomainTextChange}
                  />
              </div>
              <SkillsetDropdown
                value={placementInfo.skillset || ""}
                onChange={handleSkillsetChange}
                onTextChange={handleSkillsetTextChange}
              />
                
              <div>
              <Input
                  placeholder="Eligibility"
                  style={{ flexGrow: "1" }}
                  onChange={(e) => handleDetailsChange8(e)}
                  value={placementInfo.eligibility}
                  name="eligibility"
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
            onClick={savePlacementInfo}>
            Save changes
          </button>
        </div>
      </div>
    </Dialog>
  );
};

export default PlacementDialog;