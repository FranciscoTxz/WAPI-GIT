import React, { useEffect, useState } from "react";
import "./travels.scss";
import { useLocation } from "react-router-dom";
import Top from "../../components/TravelComponents/Top/Top";
import TravelList from "../../components/TravelComponents/TravelList/TravelList";
import FilterListIcon from "@mui/icons-material/FilterList";

import { db } from "../../firebase";
import { collection, query, where, onSnapshot } from "firebase/firestore";

const Travels = () => {
  const [data, setData] = useState([]);

  const location = useLocation();
  const searchParams = new URLSearchParams(location.search);

  // Obtén los valores de los parámetros de consulta
  const origen = searchParams.get("origen");
  const destino = searchParams.get("destino");
  const fecha = searchParams.get("fecha");

  useEffect(() => {
    const unsub = onSnapshot(
      query(
        collection(db, "viajes"),
        where("originName", "==", origen),
        where("destinationName", "==", destino),
        where("fechaSalida", "==", fecha)
      ),
      (snapshot) => {
        let list = [];
        snapshot.forEach((doc) => {
          list.push({ id: doc.id, ...doc.data() });
        });
        setData(list);
      },
      (error) => {
        console.log(error);
      }
    );

    return () => {
      unsub();
    };
  }, [origen, destino, fecha]);

  function formatDate(dateString) {
    const date = new Date(dateString);

    const month = new Intl.DateTimeFormat("es-US", { month: "long" }).format(
      date
    );
    const day = date.getDate();

    const year = date.getFullYear();

    return `${day + 1}-${month}-${year}`;
  }

  const formattedDate = formatDate(fecha);

  return (
    <div className="travels">
      <div className="topBar">
        <Top origen={origen} destino={destino} fecha={formattedDate} />
      </div>
      <div className="travelList">
        <div className="menu">
          <div className="filter">
            <FilterListIcon />
            <span>Filtrar</span>
            <span className="fecha">{formattedDate}</span>
          </div>
          <div className="titleContainer">
            <span className="title">Selecciona el horario de salida</span>
          </div>
        </div>
        <div className="list">
          <TravelList data={data} />
        </div>
      </div>
    </div>
  );
};

export default Travels;
