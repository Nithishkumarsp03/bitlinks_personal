import React, { useEffect, useState } from 'react';
import { MenuItem, FormControl, InputLabel } from '@mui/material';
import Select from 'react-select';
import Cookies from 'js-cookie';
import CryptoJS from 'crypto-js';

const SECRET_KEY = 'your-secret-key';

const AddressDropdown = ({ value, onChange, onTextChange }) => {
    const [addresses, setAddresses] = useState([]);
    const [textValue, setTextValue] = useState(value || '');

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
                        'Authorization': `Bearer ${token}`, // Include token in the headers
                        'Content-Type': 'application/json'
                    }
                });
                
                if (!response.ok) {
                    throw new Error('Network response was not ok');
                }
                
                const data = await response.json();
                const activeaddress = data.filter(address => address.status === 1);
                setAddresses(activeaddress);
            } catch (error) {
                console.error('Error fetching addresses:', error);
            }
        };

        fetchAddresses();
    }, [token]);

    const handleSelectChange = (selectedOption) => {
        const newValue = selectedOption ? selectedOption.value : '';
        setTextValue(newValue);
        onChange(newValue);
    };

    const handleTextChange = (event) => {
        const newValue = event.target.value;
        setTextValue(newValue);
        onTextChange(newValue); // Notify parent component about the text input change
    };

    const options = addresses.map(address => ({
        value: address.address_column,
        label: address.address_column, 
    }));

    return (
        <FormControl fullWidth>
            <InputLabel id="address-select-label" style={{ display: 'none' }}>Address</InputLabel>
            <Select
                placeholder={textValue ? options.find(option => option.value === textValue)?.label : 'Select Location'}
                isClearable
                labelId="address-select-label"
                value={options.find(option => option.value === textValue) || ''}
                onChange={handleSelectChange}
                options={options}
                inputProps={{ 'aria-label': 'Without label' }}
            >
                <MenuItem value="" disabled>
                    {/* <p>Company Address</p> */}
                </MenuItem>
                {addresses.map((address, index) => (
                    <MenuItem key={index} value={address.address_column}>
                        {address.address_column}
                    </MenuItem>
                ))}
            </Select>
        </FormControl>
    );
};

export default AddressDropdown;
