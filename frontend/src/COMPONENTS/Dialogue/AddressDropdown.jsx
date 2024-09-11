import React, { useEffect, useState } from 'react';
import { MenuItem, FormControl, InputLabel } from '@mui/material';
import Select from 'react-select';


const AddressDropdown = ({ value, onChange, onTextChange }) => {
    const [addresses, setAddresses] = useState([]);
    const [textValue, setTextValue] = useState(value || '');

    useEffect(() => {
        fetch(process.env.REACT_APP_API + '/addressdata')
            .then(response => response.json())
            .then(data => {
                const activeaddress = data.filter(address => address.status === 1);
                setAddresses(activeaddress);
            })
            .catch(error => {
                console.error('Error fetching addresses:', error);
            });
    }, []);
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
            <InputLabel id="address-select-label" style ={{display :'none'}}>Address</InputLabel>
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
