import React, { useEffect, useState } from 'react';
import { FormControl, InputLabel } from '@mui/material';
import Select from 'react-select';
import Cookies from 'js-cookie';
import CryptoJS from 'crypto-js';

const SECRET_KEY = 'your-secret-key';


const SkillsetDropdown = ({ value = [], onChange }) => {
    const [skillsets, setSkillsets] = useState([]);
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
        const fetchskill = async () => {
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
                const activeSkill = data.filter(role => role.status === 1);
                setSkillsets(activeSkill);
            } catch (error) {
                console.error('Error fetching roles:', error);
            }
        };

        fetchskill();
    }, [token, api]);

    const handleSelectChange = (selectedOptions) => {
        const newValues = selectedOptions ? selectedOptions.map(option => option.value) : [];
        onChange(newValues);
    };

    const options = skillsets.map(skillset => ({
        value: skillset.skillset_column,
        label: skillset.skillset_column,
    }));

    const selectedOptions = Array.isArray(value)
        ? options.filter(option => value.includes(option.value))
        : [];

    return (
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
            />
        </FormControl>
    );
};


export default SkillsetDropdown;