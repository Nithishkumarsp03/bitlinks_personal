import React, { useEffect, useState } from 'react';
import Input from '@mui/joy/Input';
import Select from 'react-select';
import Cookies from 'js-cookie';
import CryptoJS from 'crypto-js';
import { FormControl } from '@mui/material';

const SECRET_KEY = process.env.REACT_APP_SECRET_KEY; 

const DomainDropdown = ({ value, onChange, onTextChange = () => {} }) => {
    const [domains, setDomains] = useState([]);
    const [selectedOption, setSelectedOption] = useState(null);
    const [customInput, setCustomInput] = useState('');
    const api = process.env.REACT_APP_API;

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
        const fetchDomains = async () => {
            try {
                const response = await fetch(api + '/domaindata', {
                    method: 'GET',
                    headers: {
                        'Content-Type': 'application/json'
                    }
                });

                if (!response.ok) {
                    throw new Error('Network response was not ok');
                }

                const data = await response.json();
                const activeDomains = data.filter(domain => domain.status === 1);
                setDomains(activeDomains);

                // Check if the initial value is in the options
                const foundDomain = activeDomains.find(domain => domain.domain_column === value);
                if (foundDomain) {
                    setSelectedOption({ value: foundDomain.domain_column, label: foundDomain.domain_column });
                } else if (value) {
                    setSelectedOption({ value: 'Others', label: 'Others' });
                    setCustomInput(value);
                }
            } catch (error) {
                console.error('Error fetching domains:', error);
            }
        };

        fetchDomains();
    }, [token, api, value]);

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
        ...domains.map(domain => ({
            value: domain.domain_column,
            label: domain.domain_column,
        })),
        { value: 'Others', label: 'Others' }
    ];

    return (
        <div style={{display: "flex"}}>
            <FormControl fullWidth>
            <Select
                placeholder="Select a domain"
                value={selectedOption}
                onChange={handleSelectChange}
                options={options}
                isClearable
                styles={customStyles} 
            />
            </FormControl>
            <div>
            {selectedOption && selectedOption.value === 'Others' && (
                <div style={{ display: "flex", width: "170px", marginLeft: "15%",marginRight: "30px", gap: "0.5rem" }}>
                    <Input
                        fullWidth
                        placeholder='Specify the Domain'
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

export default DomainDropdown;
