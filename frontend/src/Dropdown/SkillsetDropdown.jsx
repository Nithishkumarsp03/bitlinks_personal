import React, { useEffect, useState } from 'react';
import { FormControl, InputLabel } from '@mui/material';
import Input from '@mui/joy/Input';
import Select from 'react-select';
import Cookies from 'js-cookie';
import CryptoJS from 'crypto-js';

const SECRET_KEY = 'your-secret-key';

const SkillsetDropdown = ({ value = [], onChange, onTextChange = () => {} }) => {
    const [skillsets, setSkillsets] = useState([]);
    const [customInputs, setCustomInputs] = useState([]);
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
        const fetchSkillsets = async () => {
            try {
                const response = await fetch(api + '/skilldata', {
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
                const activeSkillsets = data.filter(skillset => skillset.status === 1);
                setSkillsets(activeSkillsets);

                // Initialize custom inputs
                if (value.includes('Others')) {
                    // Initialize with an empty string for "Others"
                    setCustomInputs(['']);
                } else {
                    // Initialize custom inputs based on the current value
                    const initialCustomInputs = value.filter(val => !activeSkillsets.some(skillset => skillset.skillset_column === val));
                    setCustomInputs(initialCustomInputs);
                }
            } catch (error) {
                console.error('Error fetching skillsets:', error);
            }
        };

        fetchSkillsets();
    }, [token, api, value]);

    const handleSelectChange = (selectedOptions) => {
        const selectedValues = selectedOptions ? selectedOptions.map(option => option.value) : [];

        if (selectedValues.includes('Others')) {
            // If "Others" is selected, initialize its input as an empty string
            setCustomInputs(['']);
        } else {
            // Otherwise, set custom inputs based on selected values not in skillsets
            const newCustomInputs = selectedValues.filter(val => !skillsets.some(skillset => skillset.skillset_column === val));
            setCustomInputs(newCustomInputs);
        }

        onChange(selectedValues);
        onTextChange(selectedValues);
    };

    const handleTextChange = (index, event) => {
        const newValue = event.target.value;
        const updatedCustomInputs = [...customInputs];
        updatedCustomInputs[index] = newValue;
        setCustomInputs(updatedCustomInputs);

        const validSkillsets = value.filter(val => skillsets.some(skillset => skillset.skillset_column === val));
        const newValues = [
            ...validSkillsets,
            ...updatedCustomInputs.filter(input => input.trim() !== '')
        ];
        onChange(newValues);
        onTextChange(newValues);
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
        ...skillsets.map(skillset => ({
            value: skillset.skillset_column,
            label: skillset.skillset_column,
        })),
        { value: 'Others', label: 'Others' }
    ];

    const selectedOptions = Array.isArray(value)
        ? options.filter(option => value.includes(option.value))
        : [];

    return (
        <div style={{ display: "flex", alignItems: "flex-start", gap: "1rem" }}>
            <FormControl fullWidth>
                <InputLabel id="skillset-select-label" style={{ display: 'none' }}>Skillset</InputLabel>
                <Select
                    labelId="skillset-select-label"
                    placeholder="Skillsets"
                    value={selectedOptions}
                    isMulti
                    options={options}
                    onChange={handleSelectChange}
                    inputProps={{ 'aria-label': 'Without label' }}
                    styles={customStyles}
                />
            </FormControl>
            <div>
                {customInputs.map((input, index) => (
                    <div key={index} style={{ display: "flex", width: "170px", marginLeft: "15%", marginRight: "30px", gap: "0.5rem" }}>
                        <Input
                            fullWidth
                            placeholder='Specify the Skill'
                            margin="normal"
                            value={input}
                            onChange={(event) => handleTextChange(index, event)}
                        />
                    </div>
                ))}
            </div>
        </div>
    );
};

export default SkillsetDropdown;