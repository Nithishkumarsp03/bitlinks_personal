import React, { useState } from "react";
import Cookies from "js-cookie";
import CryptoJS from "crypto-js";
import { FiEdit, FiSave, FiTrash } from "react-icons/fi"; // Edit, Save, Delete icons
import { AiOutlineCalendar } from "react-icons/ai"; // Calendar icon
import Dialog from "@mui/material/Dialog";
import DialogActions from "@mui/material/DialogActions";
import DialogContent from "@mui/material/DialogContent";
import DialogTitle from "@mui/material/DialogTitle";
import TextField from "@mui/material/TextField";
import Button from "@mui/material/Button";
import "../MainFlow/Flows.css";

const SECRET_KEY = "your-secret-key";

export default function Minutes() {
  const [minutesList, setMinutesList] = useState([
    { id: 1, text: "Discuss project timeline", status: "Pending", date: "18/10/2024" },
    { id: 2, text: "Review budget allocation", status: "Pending", date: "18/10/2024" },
    { id: 3, text: "Finalize marketing strategy", status: "Pending", date: "18/10/2024" },
  ]);

  const [isEditing, setIsEditing] = useState(null);
  const [editData, setEditData] = useState({ text: "", date: "" });
  const [dialogOpen, setDialogOpen] = useState(false); // For managing the dialog state

  const decrypt = (ciphertext) => {
    try {
      if (ciphertext) {
        const bytes = CryptoJS.AES.decrypt(ciphertext, SECRET_KEY);
        return bytes.toString(CryptoJS.enc.Utf8);
      }
      return "";
    } catch (error) {
      console.error("Decryption error:", error.message);
      return "";
    }
  };

  const api = process.env.REACT_APP_API;
  const token = decrypt(Cookies.get("token"));

  const updateStatus = (id, newStatus) => {
    setMinutesList(prevMinutes =>
      prevMinutes.map(item =>
        item.id === id ? { ...item, status: newStatus } : item
      )
    );
  };

  const handleEdit = (id) => {
    const currentMinute = minutesList.find((item) => item.id === id);
    setEditData({ text: currentMinute.text, date: currentMinute.date });
    setIsEditing(id);
    setDialogOpen(true); // Open the dialog
  };

  const handleSave = () => {
    setMinutesList(prevMinutes =>
      prevMinutes.map(item =>
        item.id === isEditing ? { ...item, text: editData.text, date: editData.date } : item
      )
    );
    setDialogOpen(false); // Close the dialog after saving
    setIsEditing(null);
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setEditData({ ...editData, [name]: value });
  };

  return (
    <div className="minutes-container">
      {/* <h2 className="minutes-title">Meeting Minutes</h2> */}
      <ul className="minutes-list">
        {minutesList.map(item => (
          <li key={item.id} className={`minutes-item ${item.status.toLowerCase()}`}>
            <div className="minutes-details">
              <span className="minutes-text">{item.text}</span>
              <span className="minutes-date">
                <AiOutlineCalendar /> {item.date}
              </span>
              <strong className="minutes-status">{item.status}</strong>
            </div>
            <div className="button-group">
              <button
                className="status-button complete-button"
                onClick={() => updateStatus(item.id, "Completed")}
              >
                Mark as Completed
              </button>
              <button
                className="status-button impossible-button"
                onClick={() => updateStatus(item.id, "Impossible")}
              >
                Impossible
              </button>
              <button
                className="status-button edit-button"
                onClick={() => handleEdit(item.id)}
              >
                <FiEdit /> Edit
              </button>
            </div>
          </li>
        ))}
      </ul>

      {/* MUI Dialog for Editing */}
      <Dialog open={dialogOpen} onClose={() => setDialogOpen(false)} maxWidth="sm">
        <DialogTitle>Edit Meeting Minute</DialogTitle>
        <DialogContent>
          <TextField
            label="Meeting Text"
            variant="outlined"
            fullWidth
            margin="normal"
            name="text"
            value={editData.text}
            onChange={handleInputChange}
          />
          <TextField
            label="Meeting Date"
            variant="outlined"
            fullWidth
            margin="normal"
            type="date"
            name="date"
            value={editData.date}
            onChange={handleInputChange}
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={handleSave} color="primary">
            <FiSave /> Save
          </Button>
          <Button onClick={() => setDialogOpen(false)} color="secondary">
            Cancel
          </Button>
        </DialogActions>
      </Dialog>
    </div>
  );
}
