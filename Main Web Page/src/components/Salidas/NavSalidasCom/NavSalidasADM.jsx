import React from "react";
import "./navSalidasADM.scss";

import logo from "../../../assets/Conecta-01.png";
import { useNavigate } from "react-router";
import KeyboardBackspaceIcon from "@mui/icons-material/KeyboardBackspace";
import LocationOnIcon from "@mui/icons-material/LocationOn";
import TrendingFlatIcon from "@mui/icons-material/TrendingFlat";

const NavSalidasADM = ({ origen, destino, hora }) => {
  const navigate = useNavigate();
  return (
    <div className="SalidasADMHeader">
      <div className="navBarSection">
        <header className="header flex">
          <div className="logoDiv">
            <img src={logo} alt="" className="icon" />
          </div>
          <div className="dataContainer">
            <div className="cardDiv">
              <div className="detinationInput">
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
            </div>
          </div>
          <div className="cardDivDate">
            <label
              htmlFor="horaSalidaInput"
              className="hora-salida-label"
            ></label>
            <input
              className="horaInput"
              type="time"
              id="horaSalidaInput"
              placeholder="Hora de salida"
              value={hora}
            />
          </div>

          <div className="detinationInput" onClick={() => navigate(-1)}>
            <button className="btnhorario btn" type="submit">
              Horarios{" "}
            </button>
            <KeyboardBackspaceIcon className="btnback"></KeyboardBackspaceIcon>
          </div>
        </header>
      </div>
      {/*Contenido de tablas o pestañas*/}
    </div>
  );
};

export default NavSalidasADM;
