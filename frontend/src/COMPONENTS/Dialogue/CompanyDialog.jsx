import React, { useState, useEffect } from 'react';
import { Dialog, Box } from '@mui/material';
import Textarea from "@mui/joy/Textarea";
import Input from '@mui/joy/Input';
import CompanyDropdown from './CompanyDropdown';
import RoleDropdown from './RoleDropdown';
import AddressDropdown from './AddressDropdown';
import Select from 'react-select';

const CompanyDialog = ({ open, onClose, CompanyInfo, handleDetailsChange3, error, handleCompany, handleTotalValue, CalculateProgress_Company, CalculateTotal_Progress }) => {
    const [companyInfo, setCompanyInfo] = useState({ 
        companyname: '', 
        scale: '', 
        payscale: ''
    });

    // Load the initial data from CompanyInfo
    useEffect(() => {
        setCompanyInfo({
            companyname: CompanyInfo.companyname || '',
            scale: CompanyInfo.scale || '',
            payscale: CompanyInfo.payscale || ''
        });
    }, [CompanyInfo]);

    const handleRoleChange = (newRole) => {
        handleDetailsChange3({ target: { name: 'role', value: newRole } });
    };

    const handleRoleTextChange = (newText) => {
        handleDetailsChange3({ target: { name: 'role', value: newText } });
    };

    const handleScaleChange = (selectedOption) => {
        setCompanyInfo(prev => ({ ...prev, scale: selectedOption ? selectedOption.value : '' }));
        handleDetailsChange3({
            target: {
                name: 'scale',
                value: selectedOption ? selectedOption.value : ''
            },
        });
    };

    const handlePayscaleChange = (selectedOption) => {
        setCompanyInfo(prev => ({ ...prev, payscale: selectedOption ? selectedOption.value : '' }));
        handleDetailsChange3({
            target: {
                name: 'payscale',
                value: selectedOption ? selectedOption.value : ''
            },
        });
    };

    const handleKeyPress = (event) => {
        if (event.key === 'Enter') {
            event.preventDefault();  
            handleCompany(event); 
            handleTotalValue(event); 
            CalculateProgress_Company();  
            CalculateTotal_Progress();
            onClose();  
        }
    };

    const scaleOptions = [
        {value: 'Startup', label: 'Startup'},
        {value: 'Small', label: 'Small'},
        {value: 'Medium', label: 'Medium'},
        {value: 'Large', label: 'Large'},
    ];
    const payscaleOptions = [
        {value: 'Below 3 Lakhs', label: 'Below 3 Lakhs'},
        {value: '3 to 5 Lakhs', label: '3 to 5 Lakhs'},
        {value: '5 to 7 Lakhs', label: '5 to 7 Lakhs'},
        {value: '7 to 15 Lakhs', label: '7 to 15 Lakhs'},
        {value: 'Above 15 Lakhs', label: 'Above 15 Lakhs'},
    ];

    return (
        <Dialog open={open} onClose={onClose} onKeyDown={handleKeyPress}>
            <div className="dialogue" style={{ gap: "15px", display: "flex", flexDirection: "column", overflow: "auto" }}>
                <h3 style={{ fontSize: "25px", fontFamily: "Open Sans, sans-serif" }}>Company</h3>
                <div style={{ display: "flex", flexDirection: "column", gap: "15px" }}>
                    <div style={{ display: "flex", gap: "15px" }}>
                        <div  style={{width:"50%",flexGrow:"2"}}>
                        <CompanyDropdown
                            value={CompanyInfo.companyname}
                            onChange={(newCompany) => handleDetailsChange3({ target: { name: 'companyname', value: newCompany } })}
                        />
                        </div>
                        <div  style={{width:"30%",flexGrow:"1"}}>
                        <Input
                            placeholder="Position"
                            onChange={handleDetailsChange3}
                            value={CompanyInfo.position}
                            name="position"
                        />
                        </div>
                    </div>
                    <div style={{ display: "flex", gap: "15px" }}>
                        <div style={{width:"100%", flexGrow:"1"}}>
                        <Input
                            placeholder="Experience (in yrs)"
                            onChange={handleDetailsChange3}
                            value={CompanyInfo.experience}
                            type='number'
                            name="experience"
                        />
                        </div>
                        <div style={{width:"100%",flexGrow:"5"}}>
                        <RoleDropdown
                            value={CompanyInfo.role}
                            onChange={handleRoleChange}
                            onTextChange={handleRoleTextChange}
                        />
                        </div>
                    </div>
                    <div style={{width: '100%'}}>
                        <Input
                            placeholder="WebsiteUrl"
                            onChange={handleDetailsChange3}
                            value={CompanyInfo.websiteurl}
                            name="websiteurl"
                        />
                    </div>
                    <div style={{width: '100%'}}>
                        <Select 
                            options={scaleOptions} 
                            placeholder='Scale'
                            onChange={handleScaleChange}
                            value={scaleOptions.find(option => option.value === companyInfo.scale)}
                            isClearable
                        />
                    </div>
                    <div style={{width: '100%'}}>
                        <Select 
                            options={payscaleOptions} 
                            placeholder='Average Pay scale in the Industry'
                            onChange={handlePayscaleChange}
                            value={payscaleOptions.find(option => option.value === companyInfo.payscale)}
                            isClearable
                        />
                    </div>
                    <div>
                        <Box>
                            <AddressDropdown
                            value={CompanyInfo.companyaddress}
                            onChange={(newAddress) => handleDetailsChange3({ target: { name: 'companyaddress', value: newAddress } })}
                            />
                        </Box>
                    </div>
                </div>
                <p style={{ color: 'green' }}>{error}</p>
                <div id="buttonContainer-flowchart-person">
                    <button onClick={onClose} color="primary" id="discard-flowchart-person">Discard</button>
                    <button
                        color="primary"
                        id="save-flowchart-person"
                        onClick={(event) => {
                            event.preventDefault();
                            handleCompany(event);
                            handleTotalValue(event); 
                            CalculateProgress_Company();
                            CalculateTotal_Progress();
                            onClose();
                        }}>
                        Save changes
                    </button>
                </div>
            </div>
        </Dialog>
    );
};

export default CompanyDialog;
