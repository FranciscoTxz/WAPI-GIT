import React, { useState } from "react";
import "./Top";
import "./top.scss";
import TrendingFlatIcon from "@mui/icons-material/TrendingFlat";
import LocationOnIcon from "@mui/icons-material/LocationOn";
import SearchIcon from "@mui/icons-material/Search";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import { useNavigate } from "react-router-dom";

import ModalTravel from "../ModalTravel/ModalTravel";

const Top = ({ origen, destino, fecha }) => {
  const navigate = useNavigate();
  return (
    <div className="top">
      <div className="goBack" onClick={() => navigate(-1)}>
        <ArrowBackIcon className="goBackIcon" />
      </div>
      <div className="dataContainer">
        <div className="travelContainer">
          <div className="origen">
            <span>
              <LocationOnIcon className="icon2" /> {origen}
            </span>
          </div>
          <TrendingFlatIcon className="icon" />
          <div className="destino">
            <span>
              <LocationOnIcon className="icon2" /> {destino}
            </span>
          </div>
        </div>
        <div className="dateContainer">
          <div className="date">
            <span>{fecha}</span>
          </div>
        </div>
      </div>
      <div className="searchContainer">
        <div className="search">
          <SearchIcon />
        </div>
      </div>
    </div>
  );
};

export default Top;
