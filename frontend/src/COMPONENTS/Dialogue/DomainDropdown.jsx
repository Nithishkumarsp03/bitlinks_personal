import React, { useEffect, useState } from 'react';
import Select from 'react-select';

const DomainDropdown = ({ value, onChange, onTextChange }) => {
    const [domains, setDomains] = useState([]);
    const api = process.env.REACT_APP_API

    useEffect(() => {
        fetch(api + '/domaindata')
            .then(response => response.json())
            .then(data => {
                // console.log('Fetched domains:', data);
                const activeDomains = data.filter(domain => domain.status === 1);
                setDomains(activeDomains);
            })
            .catch(error => {
                console.error('Error fetching domains:', error);
            });
    }, []);

    const options = domains.map(domain => ({
        value: domain.domain_column,
        label: domain.domain_column,
    }));

    // Debugging: Check if options are correctly formatted
    // console.log('Options:', options);

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