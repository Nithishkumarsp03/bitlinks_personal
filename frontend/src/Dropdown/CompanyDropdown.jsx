import React, { useEffect, useState } from 'react';
import { MenuItem, FormControl, InputLabel } from '@mui/material';
import Select from 'react-select';
import Cookies from 'js-cookie';
import CryptoJS from 'crypto-js';

const SECRET_KEY = 'your-secret-key';

const CompanyDropdown = ({ value, onChange, onTextChange }) => {
    const [companys, setCompanys] = useState([]);
    const [textValue, setTextValue] = useState(value || '');
    const [fieldValue, setFieldValue] = useState('');

    const decrypt = (ciphertext) => {
        try {
            if (ciphertext) {
                const bytes = CryptoJS.AES.decrypt(ciphertext, SECRET_KEY);
                return bytes.toString(CryptoJS.enc.Utf8);
            }
            return '';
        } catch (error) {
            console.error("Decryption error:", error.message);
            return '';
        }
    };

    const token = decrypt(Cookies.get("token"));

    useEffect(() => {
        const fetchCompanies = async () => {
            try {
                const response = await fetch(process.env.REACT_APP_API + '/companydata', {
                    method: 'GET',
                    headers: {
                        'Authorization': `Bearer ${token}`, // Include token in the headers
                        'Content-Type': 'application/json'
                    }
                });
                
                if (!response.ok) {
                    throw new Error('Network response was not ok');
                }
                
                const data = await response.json();
                const activeCompanies = data.filter(company => company.status === 1);
                setCompanys(activeCompanies);
            } catch (error) {
                console.error('Error fetching companies:', error);
            }
        };

        fetchCompanies();
    }, [token]);

    const handleSelectChange = (selectedOption) => {
        const newValue = selectedOption ? selectedOption.value : '';
        setTextValue(newValue);
        onChange(newValue);
    };

    const handleTextChange = (event) => {
        const newValue = event.target.value;
        setTextValue(newValue);
        onTextChange(newValue);
    };

    const handleField = (e) => {
        const newValue = e.target.value;
        setFieldValue(newValue);
    };

    const options = companys.map(company => ({
        value: company.company_column,
        label: company.company_column, 
    }));

    return (
        <FormControl fullWidth>
            <InputLabel id="company-select-label" style={{ display: 'none' }}>Company</InputLabel>
            <Select
                placeholder={textValue ? options.find(option => option.value === textValue)?.label : 'Select a company'}
                labelId="company-select-label"
                value={options.find(option => option.value === textValue) || ''}
                onChange={handleSelectChange}
                options={options}
                isClearable
                inputProps={{ 'aria-label': 'Without label' }}
            >
                <MenuItem value="" disabled>       
                    <p style={{ fontFamily: 'Open Sans' }}>Company Name</p>              
                </MenuItem>
                {companys.map((company, index) => (
                    <MenuItem key={index} value={company.company_column}>
                        {company.company_column}
                    </MenuItem>
                ))}
            </Select>
        </FormControl>
    );
};

export default CompanyDropdown;
