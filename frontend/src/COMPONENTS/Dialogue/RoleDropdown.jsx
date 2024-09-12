import React, { useEffect, useState } from 'react';
import Select from 'react-select';
import Cookies from 'js-cookie';
import CryptoJS from 'crypto-js';

const SECRET_KEY = 'your-secret-key';

const RoleDropdown = ({ value, onChange }) => {
    const [roles, setRoles] = useState([]);
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
            } catch (error) {
                console.error('Error fetching roles:', error);
            }
        };

        fetchRoles();
    }, [token, api]);

    const options = roles.map(role => ({
        value: role.role_column,
        label: role.role_column,
    }));

    const handleSelectChange = (selectedOption) => {
        console.log('Selected Option:', selectedOption);
        onChange(selectedOption ? selectedOption.value : ''); // Notify parent component
    };

    return (
        <Select
            placeholder="Select a role"
            value={options.find(option => option.value === value) || null}
            onChange={handleSelectChange}
            options={options}
            isClearable
        />
    );
};

export default RoleDropdown;
