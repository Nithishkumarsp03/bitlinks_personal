import React, { useEffect, useState } from 'react';
import { FormControl, InputLabel } from '@mui/material';
import Input from '@mui/joy/Input';
import Select from 'react-select';
import Cookies from 'js-cookie';
import CryptoJS from 'crypto-js';

const SECRET_KEY = process.env.REACT_APP_SECRET_KEY;

const CompanyDropdown = ({ value, onChange, onTextChange = () => {} }) => {
  const [companies, setCompanies] = useState([]);
  const [selectedOption, setSelectedOption] = useState(null);
  const [customInput, setCustomInput] = useState('');

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
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json'
          }
        });

        if (!response.ok) {
          throw new Error('Network response was not ok');
        }

        const data = await response.json();
        const activeCompanies = data.filter(company => company.status === 1);
        setCompanies(activeCompanies);

        // Check if the initial value is in the options
        const foundCompany = activeCompanies.find(company => company.company_column === value);
        if (foundCompany) {
          setSelectedOption({ value: foundCompany.company_column, label: foundCompany.company_column });
        } else if (value) {
          setSelectedOption({ value: 'Others', label: 'Others' });
          setCustomInput(value);
        }
      } catch (error) {
        console.error('Error fetching companies:', error);
      }
    };

    fetchCompanies();
  }, [token, value]);

  const handleSelectChange = (selectedOption) => {
    setSelectedOption(selectedOption);
    const newValue = selectedOption ? selectedOption.value : '';
    if (newValue !== 'Others') {
      setCustomInput('');
      onChange(newValue);
    } else {
      onChange('');
    }
  };

  const handleTextChange = (event) => {
    const newValue = event.target.value;
    setCustomInput(newValue);
    if (selectedOption && selectedOption.value === 'Others') {
      onChange(newValue);
    }
    onTextChange(newValue);
  };



  const customStyles = {
    menuList: (provided) => ({
        ...provided,
        maxHeight: '200px',
        overflowY: 'auto',
        '&:hover': {
            overflowY: 'auto',
        },
    }),
};

  const options = [
    ...companies.map(company => ({
      value: company.company_column,
      label: company.company_column,
    })),
    { value: 'Others', label: 'Others' }
  ];

  return (
    <div style={{display: "flex"}}>
    <FormControl fullWidth >
      <InputLabel id="company-select-label" style={{ display: 'none' }}>Company</InputLabel>
      <Select
        placeholder="Select a company"
        labelId="company-select-label"
        value={selectedOption}
        onChange={handleSelectChange}
        options={options}
        isClearable
        inputProps={{ 'aria-label': 'Without label' }}
        styles={customStyles} 
      />
      {/* </div> */}
      
    </FormControl>
    <div>
    {selectedOption && selectedOption.value === 'Others' && (
      <div style={{ display: "flex", width: "170px", marginLeft: "15%",marginRight: "30px", gap: "0.5rem" }}>
        <Input
          fullWidth
          placeholder='Company name'
          margin="normal"
          value={customInput}
          onChange={handleTextChange}
        />
      </div>
    )}
    </div>
    </div>
  );
};

export default CompanyDropdown;
