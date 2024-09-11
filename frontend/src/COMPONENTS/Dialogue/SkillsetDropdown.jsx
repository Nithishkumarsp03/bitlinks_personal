import React, { useEffect, useState } from 'react';
import { FormControl, InputLabel } from '@mui/material';
import Select from 'react-select';

const SkillsetDropdown = ({ value = [], onChange }) => {
    const [skillsets, setSkillsets] = useState([]);

    useEffect(() => {
        fetch(process.env.REACT_APP_API + '/skilldata')
            .then(response => response.json())
            .then(data => { 
                const activeSkills = data.filter(skill => skill.status === 1); 
                setSkillsets(activeSkills);
            })
            .catch(error => console.error('Error fetching skillsets:', error));
    }, []);

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