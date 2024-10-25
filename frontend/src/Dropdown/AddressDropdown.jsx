import React, { useEffect, useState } from 'react';
import { FormControl, InputLabel } from '@mui/material';
import Input from '@mui/joy/Input';
import Select from 'react-select';
import Cookies from 'js-cookie';
import CryptoJS from 'crypto-js';

const SECRET_KEY = process.env.REACT_APP_SECRET_KEY;

const AddressDropdown = ({ value, onChange, onTextChange = () => {} }) => {
    const [addresses, setAddresses] = useState([]);
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
        const fetchAddresses = async () => {
            try {
                const response = await fetch(process.env.REACT_APP_API + '/addressdata', {
                    method: 'GET',
                    headers: {
                        'Content-Type': 'application/json'
                    }
                });

                if (!response.ok) {
                    throw new Error('Network response was not ok');
                }

                const data = await response.json();
                const activeAddresses = data.filter(address => address.status === 1);
                setAddresses(activeAddresses);

                // Check if the initial value is in the options
                const foundAddress = activeAddresses.find(address => address.address_column === value);
                if (foundAddress) {
                    setSelectedOption({ value: foundAddress.address_column, label: foundAddress.address_column });
                } else if (value) {
                    setSelectedOption({ value: 'Others', label: 'Others' });
                    setCustomInput(value);
                }
            } catch (error) {
                console.error('Error fetching addresses:', error);
            }
        };

        fetchAddresses();
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
            maxHeight: '100px',
            overflowY: 'auto',
            '&:hover': {
                overflowY: 'auto',
            },
        }),
    };

    const options = [
        ...addresses.map(address => ({
            value: address.address_column,
            label: address.address_column,
        })),
        { value: 'Others', label: 'Others' }
    ];

    return (
        <div style={{display: "flex"}}>
        <FormControl fullWidth>
            <InputLabel id="address-select-label" style={{ display: 'none' }}>Address</InputLabel>
            <Select
                placeholder="Select Location"
                labelId="address-select-label"
                value={selectedOption}
                onChange={handleSelectChange}
                options={options}
                isClearable
                inputProps={{ 'aria-label': 'Without label' }}
                styles={customStyles}
            />
            
        </FormControl>
        <div>
        {selectedOption && selectedOption.value === 'Others' && (
                <div style={{ display: "flex", width: "170px", marginLeft: "15%",marginRight: "30px", gap: "0.5rem" }}>
                    <Input
                        fullWidth
                        placeholder='Specify the Location'
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

export default AddressDropdown;
