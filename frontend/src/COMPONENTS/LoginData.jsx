import React, { useEffect, useState } from 'react';
import { DataGrid } from '@mui/x-data-grid';
import { Button, Dialog } from '@mui/material';
import { TextField } from '@mui/material';
import SearchIcon from '@mui/icons-material/Search';
import IconButton from '@mui/material/IconButton';
import BeatLoader from './BeatLoader';
import Cookies from 'js-cookie';
import CryptoJS from 'crypto-js';

const SECRET_KEY = 'your-secret-key';

export default function LoginData() {
  const api = process.env.REACT_APP_API
  const [rows, setRows] = useState([]);
  const [filteredRows, setFilteredRows] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [open, setOpen] = useState(false);
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(true);

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

  const handleStatusChange = async (params) => {
    const newStatus = params.value === 1 ? 0 : 1;
    try {
      const response = await fetch(api + '/updatestatuslogin', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({ id: params.row.id, status: newStatus }),
      });

      if (response.ok) {
        fetchData();
      } else {
        console.error('Failed to update status');
      }
    } catch (error) {
      console.error('Error updating status:', error);
    }
  };

  const columns = [
    { field: 'sno', headerName: 'S.No', width: 70 },
    { field: 'NAME', headerName: 'NAME', width: 200 },
    { field: 'EMAIL', headerName: 'EMAIL', width: 280 },
    { field: 'ROLE', headerName: 'ROLE', width: 100 },
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
      const response = await fetch(api + '/logindata', {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
      });
      const data = await response.json();
      setLoading(false);

      const formattedData = data.map((item, index) => ({
        id: item.ID,
        sno: index + 1,
        NAME: item.NAME,
        EMAIL: item.EMAIL,
        ROLE: item.ROLE,
        status: item.STATUS,
      }));

      setRows(formattedData);
      setFilteredRows(formattedData);
    } catch (error) {
      console.error('Error fetching data:', error);
    }
  };

  const handleSave = async () => {
    try {
      const response = await fetch(api + '/loginpost', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          name,
          email,
        }),
      });

      if (response.ok) {
        const data = await response.json();
        console.log('Data saved successfully:', data);
        setOpen(false);
        fetchData();
      }
    } catch (error) {
      console.error('Error saving data:', error);
    }
  };

  useEffect(() => {
    fetchData();

    const intervalId = setInterval(fetchData, 5000);

    return () => clearInterval(intervalId);
  }, []);

  useEffect(() => {
    const lowercasedQuery = searchQuery.toLowerCase();
    const filtered = rows.filter(row =>
      row.NAME.toLowerCase().includes(lowercasedQuery) ||
      row.EMAIL.toLowerCase().includes(lowercasedQuery) ||
      row.ROLE.toLowerCase().includes(lowercasedQuery)
    );
    setFilteredRows(filtered);
  }, [searchQuery, rows]);

  return (
    <div className='table-container-options' style={{ width: "70%" }}>
      <div style={{ display: "flex", height: "8vh", paddingBottom: "0%", border: "0.1px solid #e3e2e2", borderRadius: "3px", alignItems: "center", backgroundColor: "#f8f8f8" }}>
        <TextField
          variant="outlined"
          placeholder="Search Admins"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          InputProps={{
            endAdornment: (
              <IconButton>
                <SearchIcon />
              </IconButton>
            ),
            style: { height: "5vh", backgroundColor: "white" }
          }}
          style={{ width: "20vw", marginLeft: '7%' }}
        />
        <Button onClick={() => setOpen(true)} style={{ padding: "1% 2% 1% 2% ",marginLeft: "35%", backgroundColor: "#2867B2", borderRadius: "15px", color: "white" }}>Add Admin</Button>
      </div>
      <div className='tables' style={{ width: "100%" }}>
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
          <div style={{ padding: '20px', display: "flex",flexDirection: "column" }}>
          <h2 style={{fontSize: "16px",fontWeight: "700"}}>Add New User</h2>
            <TextField
              placeholder="Enter username"
              value={name}
              onChange={(e) => setName(e.target.value)}
              style={{ marginTop: '10%', width: '100%' }}
            />
            <TextField
              placeholder="Enter Email (as per Google norms)"
              type='email'
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              style={{ margin: '4% 0% 20% 0%', width: '100%' }}
            />
            <Button onClick={handleSave} variant="contained" color="primary">Save</Button>
          </div>
        </Dialog>
      </div>
    </div>
  );
}