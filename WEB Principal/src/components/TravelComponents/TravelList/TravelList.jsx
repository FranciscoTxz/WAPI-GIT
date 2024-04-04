import React, { useState, useEffect } from "react";
import "./travelList.scss";
import TrendingFlatIcon from "@mui/icons-material/TrendingFlat";
import MonetizationOnIcon from "@mui/icons-material/MonetizationOn";
import AccessTimeIcon from "@mui/icons-material/AccessTime";
import Button from "@mui/material/Button";
import { useNavigate } from "react-router-dom";

const TravelList = ({ data }) => {
  const navigate = useNavigate();
  const [viajes, setViajes] = useState([]);

  useEffect(() => {
    setViajes(data);
  }, [data]);

  return (
    <div className="travelList">
      {viajes.map((viaje) => (
        <div className="travel" key={viaje.id}>
          <div className="data">
            <span>{viaje.horaSalida}</span>
            <AccessTimeIcon className="timeIcon" />
            <span>{viaje.horaLlegada}</span>
            <span>|</span>
            <span>
              Estimado:{" "}
              {parseInt(viaje.horaLlegada) -
                parseInt(viaje.horaSalida) +
                " Horas"}
            </span>
          </div>

          <div className="price">
            <div className="mxn">
              <span>${viaje.precio}MXN</span>
              <MonetizationOnIcon className="iconCoin" />
            </div>

            <Button
              variant="contained"
              className="btn"
              size="small"
              onClick={() => navigate(`/departures/${viaje.id}`)}
            >
              Elegir
            </Button>
          </div>
        </div>
      ))}
    </div>
  );
};

export default TravelList;
