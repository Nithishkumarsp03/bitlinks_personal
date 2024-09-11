import React, { useEffect, useState } from 'react';
import { DataGrid } from '@mui/x-data-grid';
import { Input } from '@mui/joy';
import { Button, Dialog } from '@mui/material';
import BeatLoader from './BeatLoader';

export default function Address() {
  const api = process.env.REACT_APP_API
  const [rows, setRows] = useState([]);
  const [filteredRows, setFilteredRows] = useState([]); // State to hold filtered rows
  const [open, setOpen] = useState(false);
  const [location, setLocation] = useState('');
  const [searchQuery, setSearchQuery] = useState(''); // State for search query
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(true)

  const handleStatusChange = async (params) => {
    const newStatus = params.value === 1 ? 0 : 1;
    try {
      const response = await fetch(api + '/updatestatusaddress', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ id: params.row.id, status: newStatus }),
      });

      if (response.ok) {
        fetchData(); // Refresh data after status change
      } else {
        console.error('Failed to update status');
      }
    } catch (error) {
      console.error('Error updating status:', error);
    }
  };

  const columns = [
    { field: 'sno', headerName: 'S.No', width: 70 },
    { field: 'address_column', headerName: 'Address', width: 200 },
    {
      field: 'status',
      headerName: 'Status',
      width: 130,
      renderCell: (params) => (
        <Button
          onClick={() => handleStatusChange(params)}
          style={{ cursor: 'pointer' }}
        >
          {params.value === 1 ? 'Freeze' : 'Unfreeze'}
        </Button>
      ),
    },
  ];

  const fetchData = async () => {
    try {
      const response = await fetch(api + '/addressdata'); // Replace with your backend endpoint
      const data = await response.json();
      setLoading(false);

      const formattedData = data.map((item, index) => ({
        id: index + 1, // Assigning a unique ID based on the index
        sno: index + 1, // S.No will be the index + 1
        address_column: item.address_column,
        status: item.status,
      }));

      setRows(formattedData);
      setFilteredRows(formattedData); // Initialize filtered rows with all data
    } catch (error) {
      console.error('Error fetching data:', error);
    }
  };

  const handleSave = async () => {
    try {
      const response = await fetch(api + '/addresspost', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ location: location }),
      });

      if (response.ok) {
        const data = await response.json();
        console.log('Data saved successfully:', data);
        setError('Saved Successfully! You may now close this Dialog');
        fetchData(); // Refresh the table data
      } else {
        console.error('Failed to save data');
        setError('Failed to save data.');
      }
    } catch (error) {
      console.error('Error saving data:', error);
      setError('An error occurred while saving data.');
    }
  };

  const handleSearch = (event) => {
    setSearchQuery(event.target.value);
    const filtered = rows.filter(row =>
      row.address_column.toLowerCase().includes(event.target.value.toLowerCase())
    );
    setFilteredRows(filtered);
  };

  const downloadCSV = () => {
    const headers = ['S.No', 'Address'];
    const rowsFormatted = filteredRows.map(row => [row.sno, row.address_column]);
    const csvContent = [headers, ...rowsFormatted].map(e => e.join(",")).join("\n");
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.setAttribute('href', url);
    link.setAttribute('download', 'data.csv');
    link.click();
  };

  useEffect(() => {
    fetchData();

    // Polling mechanism to automatically update the table when data is added
    const intervalId = setInterval(fetchData, 5000); // Fetch every 5 seconds

    // Cleanup interval on component unmount
    return () => clearInterval(intervalId);
  }, []);

  return (
    <div className='tables'>
      <div style={{ marginBottom: '10px', display: 'flex', justifyContent: 'space-between' }}>
        <Input
          placeholder="Search Address"
          value={searchQuery}
          onChange={handleSearch}
          style={{ width: '300px', height: '40px', margin: '1% 0% 0% 5%' }}
        />
        <div style={{ margin: '1% 0% 0% 0%' }}>
          <Button onClick={downloadCSV}>Download CSV<i class="fa-solid fa-cloud-arrow-down" style={{marginLeft:'5px'}}></i></Button>
          <Button onClick={() => setOpen(true)} style={{ marginLeft: '10px' }}>Add</Button>
        </div>
      </div>
      <div
        style={{
          height: 400,
          width: '100%',
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
          position: 'relative', // Ensure the parent container uses relative positioning
        }}
      >
        {loading ? (
          <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100%' }}>
            <BeatLoader loading={loading} color="#2867B2" size={20} />
          </div>
        ) : (
          <DataGrid
            rows={filteredRows} // Use filteredRows instead of rows
            columns={columns}
            initialState={{
              pagination: {
                paginationModel: { page: 0, pageSize: 5 },
              },
            }}
            pageSizeOptions={[5, 10]}
            checkboxSelection
          />
        )}
      </div>

      <Dialog open={open} onClose={() => setOpen(false)}>
        <div style={{ padding: '20px' }}>
          <h2 style={{fontSize: "16px",fontWeight: "700"}}>Add New Location</h2>
          <Input
            placeholder="Enter New Location"
            value={location}
            onChange={(e) => setLocation(e.target.value)}
            style={{ margin: '10% 0% 10% 0%' }}
          />
          <Button onClick={handleSave}>Save</Button>
          {/* Only render error message if there is an error */}
          {error && <p style={{ color: 'red', textAlign: 'center' }}>{error}</p>}
        </div>
      </Dialog>
    </div>
  );
}
