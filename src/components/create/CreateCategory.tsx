import "./create_screen.css";
import ArrowBackRoundedIcon from "@mui/icons-material/ArrowBackRounded";
import { IconButton } from "@mui/material";
import { useCallback } from "react";
import { useNavigate } from "react-router-dom";

export function CreateCategory() {
  const navigate = useNavigate();
  const clickedGoBack = useCallback(() => {
    navigate(-1);
  }, []);
  return (
    <div className="container">
      <div className="text_container">
        <div className="header_container">
          <IconButton onClick={clickedGoBack} style={{ marginRight: "10px" }}>
            <ArrowBackRoundedIcon className="back_icon" />
          </IconButton>
          <h3 className="text_header">Create Category</h3>
        </div>
      </div>
    </div>
  );
}
