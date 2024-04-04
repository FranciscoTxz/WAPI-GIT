import React, { useState } from "react";
import "./home.scss";
import video from "../../assets/video_carretera.mp4";
import PlaceIcon from "@mui/icons-material/Place";
import Select from "react-select";

import OutlinedInput from "@mui/material/OutlinedInput";
import InputAdornment from "@mui/material/InputAdornment";

import { useNavigate } from "react-router-dom";

const Home = () => {
  //Variables
  const navigate = useNavigate();
  const [origen, setOrigen] = useState("");
  const [destino, setDestino] = useState("");
  const [fecha, setFecha] = useState("");

  //Vector para mapear las ciudades
  const options = [
    { label: "Ciudad de México", value: "Ciudad de México" },
    { label: "Guadalajara", value: "Guadalajara" },
    { label: "Aguascalientes", value: "Aguascalientes" },
    { label: "Nayarit", value: "Nayarit" },
    { label: "Puerto Vallarta", value: "Puerto Vallarta" },
  ];

  //Función que envia dátos a la pagina travels para obtener los viajes
  const handleGoToTravels = (origen, destino, fecha) => {
    if (origen !== "" && destino !== "" && fecha !== "") {
      navigate(`/travels?origen=${origen}&destino=${destino}&fecha=${fecha}`);
    } else {
      alert("Debes completar todos los campos");
    }
  };

  return (
    <section className="home">
      <div className="overlay"></div>
      <video
        src={video}
        muted
        autoPlay
        loop
        playsInline
        type="video/mp4"
      ></video>

      <div className="homeContent container">
        <div className="textDiv">
          <span className="smallText">Flecha Amarilla</span>
        </div>

        <div className="cardDiv grid">
          <h2 className="homeTittle">Consulta fechas y compra de boletos</h2>
          <div className="detinationInput">
            <label htmlFor="Origen">Origen</label>
            <div className="input flex">
              <Select
                className="inputSelect"
                type="text"
                placeholder="Origen"
                required
                options={options.map((option) => ({
                  value: option.value,
                  label: option.label,
                }))}
                onChange={(e) => setOrigen(e.value)}
              ></Select>
              <PlaceIcon className="icon" />
            </div>
          </div>

          <div className="detinationInput">
            <label htmlFor="Origen">Destino</label>
            <div className="input flex">
              <Select
                className="inputSelect"
                type="text"
                placeholder="Destino"
                required
                options={options.map((option) => ({
                  value: option.value,
                  label: option.label,
                }))}
                onChange={(e) => setDestino(e.value)}
              />
              <PlaceIcon className="icon" />
            </div>
          </div>

          <div className="dateInput">
            <label htmlFor="Origen">Origen</label>
            <div className="input flex">
              <OutlinedInput
                endAdornment={
                  <InputAdornment position="end">
                    ¿Cuando viajas?
                  </InputAdornment>
                }
                size="small"
                type="date"
                style={{ width: "100%", color: "gray" }}
                required
                onChange={(e) => setFecha(e.target.value)}
              />
            </div>
          </div>
        </div>

        <div className="searchOptions flex">
          <button
            type="submit"
            className="btn find"
            onClick={() => handleGoToTravels(origen, destino, fecha)}
          >
            Buscar
          </button>
        </div>
      </div>
    </section>
  );
};

export default Home;
