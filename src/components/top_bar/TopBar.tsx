import React from "react";
import "./topbar.css";
import AccountCircleIcon from "@mui/icons-material/AccountCircle";
import LogoutIcon from "@mui/icons-material/Logout";
import { ConnectedProps, connect } from "react-redux";
import { Profile, setToken } from "../../redux/reducer";
import { useNavigate } from "react-router-dom";

const mapstateToProps = (state: { token: any; profile: Profile }) => {
  return {
    token: state.token,
    profile: state.profile,
  };
};

const mapDispatchToProps = (dispatch: (arg0: any) => void) => {
  return {
    setToken: (token: any) => {
      dispatch(setToken(token));
    },
  };
};

const connectToStore = connect(mapstateToProps, mapDispatchToProps);

type Props = ConnectedProps<typeof connectToStore>;

const TopBar = (props: Props) => {
  const navigate = useNavigate();
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
          <h4 className="text_username">{props.profile.username}</h4>
          <span
            onClick={() => {
              props.setToken(null);
              navigate("/login");
            }}
          >
            <LogoutIcon className="logoutIcon" />
          </span>
        </div>
      </div>
    </div>
  );
};

export default connectToStore(TopBar);
