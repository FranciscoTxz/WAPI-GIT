import React, { useState, useEffect } from "react";
import AccessTimeIcon from "@mui/icons-material/AccessTime";
import "./listHistory.scss";
import { db } from "../../firebase";
import { collection, query, where, getDocs } from "firebase/firestore";

const ListHistory = () =>{
  return (
    <div className="travelList">
      <h2>Historial de Viajes</h2>
        <div className="travel">
          <div className="data">
            <span>|</span>
            <span>Aguascalientes</span> {/* Actualiza con el nombre real del campo */}
            <span>|</span>
            <AccessTimeIcon className="timeIcon" />
            <span>12:00pm</span> {/* Actualiza con el nombre real del campo */}
            <span>|</span>
            <span>Guadalajara</span> {/* Actualiza con el nombre real del campo */}
            <span>|</span>
            <span>05/04/2024</span> {/* Actualiza con el nombre real del campo */}
            <span>|</span>
          </div>
        </div>
      ))}
    </div>
  );
};

export default ListHistory;
