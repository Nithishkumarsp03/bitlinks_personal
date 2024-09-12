import React, { useEffect, useState } from 'react';
import Select from 'react-select';
import Cookies from 'js-cookie';
import CryptoJS from 'crypto-js';

const SECRET_KEY = 'your-secret-key';

const DomainDropdown = ({ value, onChange, onTextChange }) => {
    const [domains, setDomains] = useState([]);
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
                        'Authorization': `Bearer ${token}`, // Include token in the headers
                        'Content-Type': 'application/json'
                    }
                });
                
                if (!response.ok) {
                    throw new Error('Network response was not ok');
                }
                
                const data = await response.json();
                const activeDomains = data.filter(domain => domain.status === 1);
                setDomains(activeDomains);
            } catch (error) {
                console.error('Error fetching domains:', error);
            }
        };

        fetchDomains();
    }, [token, api]);

    const options = domains.map(domain => ({
        value: domain.domain_column,
        label: domain.domain_column,
    }));

    const handleSelectChange = (selectedOption) => {
        const newValue = selectedOption ? selectedOption.value : '';
        console.log('Selected Option:', newValue); // Debugging
        onChange(newValue);
    };

    const selectedOption = options.find(option => option.value === value) || null;

    return (
        <Select
            placeholder="Select a domain"
            value={selectedOption}
            onChange={handleSelectChange}
            options={options}
            isClearable
        />
    );
};

export default DomainDropdown;
