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
import MinutesDropdown from "../../../Dropdown/MinutesDropdown";
import "./Minutes.css";
import "../MainFlow/Flows.css";

const SECRET_KEY = process.env.REACT_APP_SECRET_KEY;

export default function Minutes() {
  const [minutesList, setMinutesList] = useState([]);
  const [isEditing, setIsEditing] = useState(null);
  const [editData, setEditData] = useState({
    minutes: "",
    deadline: "",
    person: "",
  });
  const [dialogOpen, setDialogOpen] = useState(false); // For managing the dialog state
  const [commentDialogOpen, setCommentDialogOpen] = useState(false); // For managing comment dialog
  const [comment, setComment] = useState(""); // State for storing comment
  const { selectedPersonId } = usePerson();
  const [addopen, setAddopen] = useState(false);
  const [minutes, setMinutes] = useState("");
  const [deadline, setDeadline] = useState("");
  const [handler, setHandler] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [statusloading, setStatusloading] = useState(false);
  const [addloading, setAddloading] = useState(true);
  const [loadingId, setLoadingId] = useState(null); // Track the item being updated

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

  const handleChange = (selectedOption) => {
    setHandler(selectedOption ? selectedOption.value : null);
  };


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
    setLoadingId(id); // Set loadingId when update starts
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
    setLoadingId(null); // Reset loadingId after update
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
      person: currentMinute.handler,
    });

    setIsEditing(id);
    setDialogOpen(true); // Open the dialog
  };

  const handleSave = async () => {
    setLoadingId(isEditing); // Set loading for the current item
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
          handler: editData.person,
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
    setLoadingId(null); // Reset loadingId after saving
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
      updateStatus(isEditing, "Requested", comment); // Pass comment while updating status
    } else {
      alert("Please enter a comment before submitting.");
    }
  };

  const handleaddminutes = async () => {

    // console.log(handler);
    setAddloading(true);
    if (minutes === "") {
      setError("Please enter minutes before submitting.");
      return;
    }
    else if(deadline === ""){
      setError("Please select the date before Submitting");
      return;
    }
    else if(handler === ""){
      setError("Please select the person for the Minute")
      return;
    }
    try {
      const res = await fetch(api + "/addminutes", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ selectedPersonId, username, minutes, deadline, handler }),
      });
      if (res.ok) {
        setAddloading(false);
        fetchMinutes();
        setMinutes("");
        setDeadline("");
        setHandler("")
        setError("");
        setAddopen(false);
      }
    } catch (error) {
      setAddloading(false);
      console.error("Error adding minutes");
    }
  };


  const sortedMinutesList = minutesList.sort((a, b) => {
    const statusOrder = {
      pending: 1,
      Completed: 2,
      Impossible: 3,
    };
    return statusOrder[a.status] - statusOrder[b.status];
  });  

  return (
    <>
      {loading ? (
  <div
    style={{
      display: "flex",
      justifyContent: "center",
      alignItems: "center",
      height: "35vh",
    }}
  >
    <BeatLoader loading={loading} color="#2867B2" size={15} />
  </div>
) : (
  <div className="minutes-container">
    <div style={{ display: "flex", justifyContent: "end", marginRight: "20px" }}>
      <Button onClick={() => setAddopen(true)} className="add-button-minutes">
        Add
      </Button>
    </div>
    {minutesList.length > 0 ? (
      <ul className="minutes-list">
        {sortedMinutesList.map((item) => (
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
              <strong className="minutes-status">
                {loadingId === item.id ? (
                  <BeatLoader
                    loading={true}
                    color="#2867B2"
                    size={5}
                    className="beatloader"
                  />
                ) : (
                  <p>{item.status}</p>
                )}
              </strong>
            </div>
            {item.status === "pending" && (
              <div className="button-group">
                <>
                  <button
                    className="status-button complete-button"
                    onClick={() => updateStatus(item.id, "Requested")}
                    disabled={item.status !== "pending"}
                  >
                    Mark as Completed
                  </button>
                  <button
                    className="status-button impossible-button"
                    onClick={() => handleImpossibleClick(item.id)}
                    disabled={item.status !== "pending"}
                  >
                    Mark as Impossible
                  </button>
                  <button className="edit-button" onClick={() => handleEdit(item.id)}>
                    <FiEdit />
                  </button>
                </>
              </div>
            )}
          </li>
        ))}
      </ul>
    ) : (
      <div className="empty-error">
                <div>
                  <i className="fa-solid fa-circle-info"></i>
                  <p>No Minutes Found</p>
                </div>
              </div>
    )}
  </div>
)}

      {/* Add minutes dialog */}
      <Dialog open={addopen} onClose={() => setAddopen(false)}>
        <DialogTitle>Add Minutes</DialogTitle>
        <DialogContent>

          <TextField
            margin="dense"
            label="Minutes"
            fullWidth
            value={minutes}
            autoComplete="off"
            onChange={(e) => setMinutes(e.target.value)}
          />
          <TextField
            margin="dense"
            label="Deadline"
            autoComplete="off"
            type="date"
            required
            fullWidth
            InputLabelProps={{
              shrink: true,
            }}
            value={deadline}
            onChange={(e) => setDeadline(e.target.value)}
          />
          <MinutesDropdown handleChange={handleChange} />
          
        </DialogContent>
        <p style={{textAlign: "center", fontWeight: "500", color: "red"}}>{error}</p>
        <DialogActions>
          <Button onClick={() => setAddopen(false)}>Cancel</Button>
          <Button onClick={handleaddminutes}>Submit</Button>
        </DialogActions>
        
      </Dialog>

      {/* Edit minutes dialog */}
      <Dialog open={dialogOpen} onClose={() => setDialogOpen(false)}>
        <DialogTitle>Edit Minutes</DialogTitle>
        <DialogContent>
          <TextField
            margin="dense"
            label="Minutes"
            fullWidth
            autoComplete="off"
            name="minutes"
            value={editData.minutes}
            onChange={handleInputChange}
          />
          <TextField
            margin="dense"
            label="Deadline"
            type="date"
            fullWidth
            name="deadline"
            InputLabelProps={{
              shrink: true,
            }}
            value={editData.deadline}
            onChange={handleInputChange}
          />
          <TextField
            margin="dense"
            label="Target Person"
            name="person"
            value={editData.person}
            autoComplete="off"
            fullWidth
            onChange={handleInputChange}
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setDialogOpen(false)}>Cancel</Button>
          <Button onClick={handleSave}>Save</Button>
        </DialogActions>
      </Dialog>

      {/* Comment dialog for Impossible button */}
      <Dialog
        open={commentDialogOpen}
        onClose={() => setCommentDialogOpen(false)}
        maxWidth="lg"
        >
        <DialogTitle>Enter Comment</DialogTitle>
        <DialogContent>
          <TextField
            margin="dense"
            label="Comment"
            fullWidth
            multiline
            value={comment}
            onChange={(e) => setComment(e.target.value)}
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setCommentDialogOpen(false)}>Cancel</Button>
          <Button onClick={handleCommentSave}>Submit</Button>
        </DialogActions>
      </Dialog>
    </>
  );
}
