import React from "react";
import logo from "../../assets/WAPI.png";
import KeyboardBackspaceIcon from "@mui/icons-material/KeyboardBackspace";
import { useNavigate } from "react-router";

const HeaderHistory = () => {
  const navigate = useNavigate();
  return (
    <div className="history-container">
      <header className="header ">
        <div className="logoDiv">
          <a href="#" className="logo flex">
            <h1>
              <img src={logo} alt="" className="icon" />
            </h1>
          </a>
        </div>
        <KeyboardBackspaceIcon
          className="btnback"
          onClick={() => navigate(-1)}
          style = {{cursor:"pointer"}}
        />
      </header>
    </div>
  );
};
export default HeaderHistory;
