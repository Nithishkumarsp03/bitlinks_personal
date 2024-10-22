import React, { useEffect, useState } from 'react';
import Input from '@mui/joy/Input';
import Select from 'react-select';
import Cookies from 'js-cookie';
import CryptoJS from 'crypto-js';
import { FormControl } from '@mui/material';

const SECRET_KEY = process.env.REACT_APP_SECRET_KEY;

const RoleDropdown = ({ value, onChange, onTextChange = () => {} }) => {
    const [roles, setRoles] = useState([]);
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
        const fetchRoles = async () => {
            try {
                const response = await fetch(api + '/roledata', {
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
                const activeRoles = data.filter(role => role.status === 1);
                setRoles(activeRoles);

                // Check if the initial value is in the options
                const foundRole = activeRoles.find(role => role.role_column === value);
                if (foundRole) {
                    setSelectedOption({ value: foundRole.role_column, label: foundRole.role_column });
                } else if (value) {
                    setSelectedOption({ value: 'Others', label: 'Others' });
                    setCustomInput(value);
                }
            } catch (error) {
                console.error('Error fetching roles:', error);
            }
        };

        fetchRoles();
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
            maxHeight: '150px',
            overflowY: 'auto',
            '&:hover': {
                overflowY: 'auto',
            },
        }),
    };

    const options = [
        ...roles.map(role => ({
            value: role.role_column,
            label: role.role_column,
        })),
        { value: 'Others', label: 'Others' }
    ];

    return (
        <div style={{display: "flex",width: "100%"}}>
            <FormControl fullWidth>
            <Select
                placeholder="Select a role"
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
                        placeholder='Specify the Role'
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

export default RoleDropdown;
