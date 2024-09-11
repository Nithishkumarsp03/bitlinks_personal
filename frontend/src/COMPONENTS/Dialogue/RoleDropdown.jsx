import React, { useEffect, useState } from 'react';
import Select from 'react-select';

const RoleDropdown = ({ value, onChange }) => {
    const [roles, setRoles] = useState([]);

    useEffect(() => {
        fetch(process.env.REACT_APP_API + '/roledata')
            .then(response => response.json())
            .then(data => {
                const activeRoles = data.filter(role => role.status === 1);
                setRoles(activeRoles);
            })
            .catch(error => {
                console.error('Error fetching roles:', error);
            });
    }, []);

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