import React, { useState, useEffect } from "react";
import Cookies from "js-cookie";
import CryptoJS from "crypto-js";
import { FiEdit, FiSave } from "react-icons/fi"; // Edit, Save icons
import { AiOutlineCalendar } from "react-icons/ai"; // Calendar icon
import Agent from "../../../Assets/Agent.svg";
import Dialog from "@mui/material/Dialog";
import DialogActions from "@mui/material/DialogActions";
import DialogContent from "@mui/material/DialogContent";
import DialogTitle from "@mui/material/DialogTitle";
import TextField from "@mui/material/TextField";
import Button from "@mui/material/Button";
import { usePerson } from "../../../COMPONENTS/Context";
import BeatLoader from "../../../COMPONENTS/BeatLoader";
import "./Minutes.css";
import "../MainFlow/Flows.css";

const SECRET_KEY = "your-secret-key";

export default function Minutes() {
  const [minutesList, setMinutesList] = useState([]);
  const [isEditing, setIsEditing] = useState(null);
  const [editData, setEditData] = useState({
    minutes: "",
    deadline: "",
  });
  const [dialogOpen, setDialogOpen] = useState(false); // For managing the dialog state
  const [commentDialogOpen, setCommentDialogOpen] = useState(false); // For managing comment dialog
  const [comment, setComment] = useState(""); // State for storing comment
  const { selectedPersonId } = usePerson();
  const [addopen, setAddopen] = useState(false);
  const [minutes, setMinutes] = useState("");
  const [deadline, setDeadline] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [statusloading, setStatusloading] = useState(false);
  const [addloading, setAddloading] = useState(true);

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
  const username = decrypt(Cookies.get("name"));

  const fetchMinutes = async () => {
    setLoading(true);
    try {
      const res = await fetch(api + "/minutes", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ selectedPersonId }),
      });
      if (res.ok) {
        const data = await res.json();
        setMinutesList(data);
        setLoading(false);
      }
    } catch (error) {
      console.error("Error fetching Minutes");
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchMinutes();
  }, []);

  const updateStatus = async (id, newStatus, comment = "") => {
    setStatusloading(true);
    try {
      const res = await fetch(api + "/updateminutes", {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ id, newStatus, comment }),
      });
      if (res.ok) {
        const data = await res.json();
        fetchMinutes(); // Refresh minutes after updating status
        setCommentDialogOpen(false); // Close comment dialog
        setStatusloading(false);
      }
    } catch (error) {
      console.error("Error updating status");
      setStatusloading(false);
    }
  };

  const handleEdit = (id) => {
    const currentMinute = minutesList.find((item) => item.id === id);

    // Create a Date object from the UTC deadline
    const utcDate = new Date(currentMinute.deadline);

    // Add one day to the date
    const adjustedDate = new Date(utcDate);
    adjustedDate.setDate(adjustedDate.getDate() + 1);

    // Format the adjusted date as yyyy-mm-dd for the date input
    const formattedDate = adjustedDate.toISOString().split("T")[0];

    setEditData({
      minutes: currentMinute.minutes,
      deadline: formattedDate, // Date with one day added
    });

    setIsEditing(id);
    setDialogOpen(true); // Open the dialog
  };

  const handleSave = async () => {
    try {
      const res = await fetch(api + "/updatesaveminutes", {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          id: isEditing,
          minutes: editData.minutes,
          deadline: editData.deadline,
        }),
      });
      if (res.ok) {
        fetchMinutes(); // Refresh minutes after saving changes
        setDialogOpen(false);
      }
    } catch (error) {
      console.error("Error saving Minutes");
    }

    setDialogOpen(false); // Close the dialog after saving
    setIsEditing(null);
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setEditData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

  // Function to handle "Impossible" button click and open comment dialog
  const handleImpossibleClick = (id) => {
    setComment(""); // Reset the comment field
    setCommentDialogOpen(true);
    setIsEditing(id); // Set the current minute being edited
  };

  const handleCommentSave = () => {
    if (comment.trim()) {
      updateStatus(isEditing, "Impossible", comment); // Pass comment while updating status
    } else {
      alert("Please enter a comment before submitting.");
    }
  };

  const handleaddminutes = async () => {
    setAddloading(true);
    if(minutes === "" && deadline === ""){
      setError("Please enter minutes and deadline before submitting.");
      return;
    }
    try {
      const res = await fetch(api + "/addminutes", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ selectedPersonId, username, minutes, deadline }),
      });
      if (res.ok) {
        setAddloading(false);
        fetchMinutes();
        setMinutes("");
        setDeadline("");
        setError("");
        setAddopen(false);
      }
    } catch (error) {
      setAddloading(false);
      console.error("Error adding minutes");
    }
  };

  return (
    <>
    {loading?(
      <div style={{display: 'flex', justifyContent: 'center', alignItems: 'center', height: "35vh"}}>
        <BeatLoader loading={loading} color="#2867B2" size={15} />
      </div>
    ):(
      <div className="minutes-container">
      <button onClick={() => setAddopen(true)}>Add</button>
      <ul className="minutes-list">
        {minutesList.map((item) => (
          <li
            key={item.id}
            className={`minutes-item ${item.status.toLowerCase()}`}
          >
            <div className="minutes-details">
              <span className="minutes-text">{item.minutes}</span>
              <span className="minutes-date">
                <AiOutlineCalendar />{" "}
                {new Date(item.date).toLocaleDateString("en-GB")}{" "}
                <span style={{ fontSize: "15px", color: "black" }}>-</span>{" "}
                <AiOutlineCalendar />{" "}
                {new Date(item.deadline).toLocaleDateString("en-GB")}
              </span>
              <strong className="minutes-status">{item.status}</strong>
            </div>
            {item.status === "pending" ? (
              <div className="button-group">
                <button
                  className="status-button complete-button"
                  onClick={() => updateStatus(item.id, "Completed")}
                  disabled={item.status !== "pending"} // Disable if status is not "pending"
                >
                  Mark as Completed
                </button>
                <button
                  className="status-button impossible-button"
                  onClick={() => handleImpossibleClick(item.id)} // Open comment dialog
                  disabled={item.status !== "pending"} // Disable if status is not "pending"
                >
                  Impossible
                </button>
                <button
                  className="status-button edit-button"
                  onClick={() => handleEdit(item.id)}
                  disabled={item.status !== "pending"} // Disable if status is not "pending"
                >
                  <FiEdit /> Edit
                </button>
              </div>
            ) : (
              ""
            )}
          </li>
        ))}
      </ul>

      {/* MUI Dialog for Editing */}
      <Dialog
        open={dialogOpen}
        onClose={() => setDialogOpen(false)}
        maxWidth="sm"
      >
        <DialogTitle>Edit Meeting Minute</DialogTitle>
        <DialogContent>
          <TextField
            label="Meeting Minutes"
            variant="outlined"
            fullWidth
            margin="normal"
            name="minutes"
            value={editData.minutes}
            onChange={handleInputChange}
          />
          <TextField
            label="Deadline"
            type="date"
            variant="outlined"
            fullWidth
            margin="normal"
            name="deadline"
            value={editData.deadline}
            onChange={handleInputChange}
          />
        </DialogContent>
        <DialogActions className="buttons-minutes">
          <Button onClick={handleSave} color="primary">
            <FiSave /> Save
          </Button>
          <Button onClick={() => setDialogOpen(false)} color="secondary">
            Cancel
          </Button>
        </DialogActions>
      </Dialog>

      <Dialog open={addopen} onClose={() => setAddopen(false)} maxWidth="sm">
        <DialogTitle>Add Meeting Minute</DialogTitle>
        <DialogContent>
          <TextField
            label="Meeting Minutes"
            variant="outlined"
            fullWidth
            margin="normal"
            name="minutes"
            value={minutes}
            onChange={(e) => setMinutes(e.target.value)}
            autoComplete="off"
          />
          <TextField
            // label="Deadline"
            type="date"
            variant="outlined"
            fullWidth
            margin="normal"
            name="deadline"
            value={deadline}
            onChange={(e) => setDeadline(e.target.value)}
          />
        </DialogContent>
        <p style={{textAlign: "center", color: "red", fontWeight: "500"}}>{error}</p>
        <DialogActions className="buttons-minutes">
          <Button onClick={handleaddminutes} color="primary">
            Add Minute
          </Button>
          <Button onClick={() => setDialogOpen(false)} color="secondary">
            Cancel
          </Button>
        </DialogActions>
      </Dialog>

      {/* Comment Dialog for Impossible */}
      <Dialog
        open={commentDialogOpen}
        onClose={() => setCommentDialogOpen(false)}
        maxWidth="sm"
      >
        <DialogTitle>Provide a Comment for Impossible</DialogTitle>
        <DialogContent>
          <TextField
            label="Comment"
            variant="outlined"
            fullWidth
            margin="normal"
            value={comment}
            onChange={(e) => setComment(e.target.value)}
            multiline
            rows={4}
          />
        </DialogContent>
        <DialogActions className="buttons-minutes">
          <Button onClick={handleCommentSave} color="primary">
            Save
          </Button>
          <Button onClick={() => setCommentDialogOpen(false)} color="secondary">
            Cancel
          </Button>
        </DialogActions>
      </Dialog>
    </div>
    )}
    </>
  );
}
