import React, { useEffect, useState } from 'react';
import { Dialog } from '@mui/material';
import Input from '@mui/joy/Input';
import DomainDropdown from './DomainDropdown';
import SkillsetDropdown from './SkillsetDropdown';

const ExpertiseDialog = ({ open, onClose, ExpertiseInfo, handleDetailsChange4, error, handleExpertise, CalculateProgress_Expertise, CalculateTotal_Progress }) => {
  // Initialize state with props data
  const [expertiseInfo, setExpertiseInfo] = useState({ 
    domain: ExpertiseInfo.domain || '', 
    specialistskills: ExpertiseInfo.specialistskills || '', 
    skillset: Array.isArray(ExpertiseInfo.skillset) ? ExpertiseInfo.skillset : []
  });

  // Sync expertiseInfo with props changes
  useEffect(() => {
    setExpertiseInfo({ 
      domain: ExpertiseInfo.domain || '',
      specialistskills: ExpertiseInfo.specialistskills || '', 
      skillset: Array.isArray(ExpertiseInfo.skillset) ? ExpertiseInfo.skillset : []
    });
  }, [ExpertiseInfo]);

  const handleDomainChange = (newDomain) => {
    console.log("Selected domain from dropdown:", newDomain);
    setExpertiseInfo(prev => {
      const updatedInfo = { ...prev, domain: newDomain };
      
      // Update ExpertiseInfo with the new domain value immediately after setting state
      handleDetailsChange4({
        target: {
          name: 'domain',
          value: updatedInfo.domain,
        },
      });
      
      return updatedInfo;
    });
  };

  const handleTextChange = (newText) => {
    setExpertiseInfo(prev => ({ ...prev, domain: newText }));
  };

  const saveExpertiseInfo = (event) => {
    event.preventDefault();
    
    // Update ExpertiseInfo with expertiseInfo state
    handleDetailsChange4({
      target: {
        name: 'domain',
        value: expertiseInfo.domain || '',
      },
    });

    handleExpertise(event);
  };

  const handleSkillsetChange = (newSkillset) => {
    setExpertiseInfo(prev => ({ ...prev, skillset: newSkillset }));
    handleDetailsChange4({ target: { name: 'skillset', value: newSkillset } });
  };

  const handleSkillsetTextChange = (newText) => {
    setExpertiseInfo(prev => ({ ...prev, skillset: newText }));
    handleDetailsChange4({ target: { name: 'skillset', value: newText } });
  };

  const handleKeyPress = (event) => {
    if (event.key === 'Enter') {
      event.preventDefault();  
      handleExpertise(event); 
      CalculateProgress_Expertise(); 
      CalculateTotal_Progress();
    }
  };

  return (
    <Dialog open={open} onClose={onClose} onKeyDown={handleKeyPress} style={{ paddingInline: '5em' }}>
      <div
        className="dialogue"
        style={{
          gap: "25px",
          display: "flex",
          flexDirection: "column",
          overflow: "auto",
        }}>
        <h3
          style={{
            fontSize: "25px",
            fontFamily: "Open Sans, sans-serif",
          }}>
          Expertise
        </h3>
        <div style={{ display: "flex", gap: "25px" }}>
          <DomainDropdown
            value={expertiseInfo.domain} // Ensure correct value is passed
            onChange={handleDomainChange}
            onTextChange={handleTextChange}
          />
          <Input
            placeholder="Specialist Skills"
            onChange={(e) => {
              const { name, value } = e.target;
              setExpertiseInfo(prev => ({ ...prev, specialistskills: value }));
              handleDetailsChange4(e);
            }}
            value={expertiseInfo.specialistskills || ""}
            name="specialistskills"
          />
        </div>
        <div style={{ marginTop: "20px" }}>
          <SkillsetDropdown
            value={expertiseInfo.skillset || ""}
            onChange={handleSkillsetChange}
            onTextChange={handleSkillsetTextChange}
          />
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
            onClick={saveExpertiseInfo}>
            Save changes
          </button>
        </div>
      </div>
    </Dialog>
  );
};

export default ExpertiseDialog;