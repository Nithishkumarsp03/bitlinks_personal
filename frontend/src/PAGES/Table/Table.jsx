import React from "react";
import "./Table.css";

export default function Table({handlecanceltable}) {
  return (
    <div className="table-navbar">
      <div style={{display: "flex"}}>
        <i
          class="fa-solid fa-arrow-left"
          alt="cancel-img"
          style={{ width: "3%", marginRight: "40%", cursor: "pointer" }}
          onClick={handlecanceltable}
        />
        <div>We'll be here soon!</div>
      </div>
    </div>
  );
}
