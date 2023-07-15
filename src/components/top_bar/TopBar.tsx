import React from "react";
import "./topbar.css";
import AccountCircleIcon from "@mui/icons-material/AccountCircle";
import LogoutIcon from "@mui/icons-material/Logout";

export function TopBar() {
  return (
    <div className="topbar">
      <div className="topbarWrapper">
        <div className="topLeft">
          <img
            src={require("../../assets/images/logo.jpg")}
            alt=""
            className="logo"
          />
          <h2 className="text">Sar Oak Sin</h2>
        </div>
        <div className="topRight">
          <AccountCircleIcon fontSize="medium" className="profileIcon" />
          <h4 className="text_username">Username</h4>
          <LogoutIcon className="logoutIcon" />
        </div>
      </div>
    </div>
  );
}
