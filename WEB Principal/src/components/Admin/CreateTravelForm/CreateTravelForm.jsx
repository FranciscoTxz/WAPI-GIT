import React, { useContext, useState } from "react";
import "./createTravelForm.scss";

import OutlinedInput from "@mui/material/OutlinedInput";
import InputAdornment from "@mui/material/InputAdornment";
import LogoutIcon from "@mui/icons-material/Logout";
import Button from "@mui/material/Button";
import random from "random";

import InputLabel from "@mui/material/InputLabel";
import MenuItem from "@mui/material/MenuItem";
import FormControl from "@mui/material/FormControl";
import Select from "@mui/material/Select";

import { AuthContext } from "../../../context/AuthContext";
import { useNavigate, Navigate } from "react-router-dom";

const CreateTravelForm = () => {
  const navigate = useNavigate();

  const [id_viaje, setId_viaje] = useState(random.int(10000, 100000));
  const [originStationCode, setOriginStationCode] = useState(null);
  const [destinationStationCode, setDestinationStationCode] = useState(null);
  const [originName, setOriginName] = useState(null);
  const [destinationName, setDestinationName] = useState(null);
  const [carriage, setCarriage] = useState(null);
  const [zone, setZone] = useState(null);
  const [horaSalida, setHoraSalida] = useState(null);
  const [horaLlegada, setHoraLlegada] = useState(null);
  const [fechaSalida, setfFechaSalida] = useState(null);
  const [fechaLlegada, setfechaLlegada] = useState(null);
  const [precio, setPrecio] = useState(null);
  const [cñ, setCñ] = useState("Prueba1234");

  const { dispatch } = useContext(AuthContext);
  const { currentUser } = useContext(AuthContext);

  const options = [
    { label: "CDMX", value: "CDMX" },
    { label: "GDL", value: "GDL" },
    { label: "AGS", value: "AGS" },
    { label: "NCHS", value: "NCHS" },
    { label: "MTY", value: "MTY" },
  ];

  const cities = [
    { label: "Ciudad de México", value: "Ciudad de México" },
    { label: "Guadalajara", value: "Guadalajara" },
    { label: "Aguascalientes", value: "Aguascalientes" },
    { label: "Nochistlan", value: "Nochistlan" },
    { label: "Monterrey", value: "Monterrey" },
  ];

  const handleSubmit = async () => {
    if (
      id_viaje !== null &&
      originStationCode !== null &&
      destinationStationCode !== null &&
      originName !== null &&
      destinationName !== null &&
      zone !== null &&
      carriage !== null &&
      horaSalida !== null &&
      horaLlegada !== null &&
      precio !== null
    ) {
      try {
        const response = await fetch(
          `https://caviajes-klapxs6vqa-uc.a.run.app?id=${id_viaje}&osc=${originStationCode}&dsc=${destinationStationCode}&on=${originName}&dn=${destinationName}&c=${carriage}&z=${zone}&hs=${horaSalida}&hl=${horaLlegada}&fs=${fechaSalida}&fl=${fechaLlegada}&p=${precio}&cñ=${cñ}`
        );

        if (!response.ok) {
          throw new Error(`Error al obtener el objeto: ${response.status}`);
        }

        const data = await response.json();
        console.log(data);
        alert("Se creó el viaje satisfactoriamente");
      } catch (error) {
        console.log(error);
      }
    } else {
      alert("Necesitas llenar los datos para crear viajes");
    }
  };

  const logOut = () => {
    try {
      dispatch({ type: "LOGOUT", payload: currentUser });
    } catch (error) {
      console.log(error);
    }
  };

  const regresar = () => {
    navigate(-1);
  }

  return (
    <div className="createForm">
      <div className="title">
        <h2>Crear viajes</h2>
        <span style={{ cursor: "pointer" }}>
          <LogoutIcon onClick={regresar}/>
        </span>
      </div>
      <hr />
      <form>
        <div className="fila">
          <FormControl fullWidth>
            <InputLabel id="demo-simple-select-label">Codigo Origen</InputLabel>
            <Select
              labelId="demo-simple-select-label"
              id="demo-simple-select"
              label="Age"
              className="inputViaje"
              required
              onChange={(e) => setOriginStationCode(e.target.value)}
            >
              {options.map((data) => (
                <MenuItem value={data.value}>{data.label}</MenuItem>
              ))}
            </Select>
          </FormControl>
          <FormControl fullWidth>
            <InputLabel id="demo-simple-select-label">
              Codigo Destino
            </InputLabel>
            <Select
              labelId="demo-simple-select-label"
              id="demo-simple-select"
              label="Age"
              className="inputViaje"
              required
              onChange={(e) => setDestinationStationCode(e.target.value)}
            >
              {options.map((data) => (
                <MenuItem value={data.value}>{data.label}</MenuItem>
              ))}
            </Select>
          </FormControl>
          <FormControl fullWidth>
            <InputLabel id="demo-simple-select-label">Origen</InputLabel>
            <Select
              labelId="demo-simple-select-label"
              id="demo-simple-select"
              label="Age"
              className="inputViaje"
              required
              onChange={(e) => setOriginName(e.target.value)}
            >
              {cities.map((data) => (
                <MenuItem value={data.value}>{data.label}</MenuItem>
              ))}
            </Select>
          </FormControl>
          <FormControl fullWidth>
            <InputLabel id="demo-simple-select-label">Destino</InputLabel>
            <Select
              labelId="demo-simple-select-label"
              id="demo-simple-select"
              label="Age"
              className="inputViaje"
              required
              onChange={(e) => setDestinationName(e.target.value)}
            >
              {cities.map((data) => (
                <MenuItem value={data.value}>{data.label}</MenuItem>
              ))}
            </Select>
          </FormControl>
        </div>
        <div className="fila">
          <OutlinedInput
            id="outlined-adornment-weight"
            endAdornment={
              <InputAdornment position="end">Carriage</InputAdornment>
            }
            aria-describedby="outlined-weight-helper-text"
            inputProps={{
              "aria-label": "weight",
            }}
            className="inputViaje"
            required
            onChange={(e) => setCarriage(e.target.value)}
          />
          <OutlinedInput
            id="outlined-adornment-weight"
            endAdornment={<InputAdornment position="end">Zone</InputAdornment>}
            aria-describedby="outlined-weight-helper-text"
            inputProps={{
              "aria-label": "weight",
            }}
            className="inputViaje"
            required
            onChange={(e) => setZone(e.target.value)}
          />

          <OutlinedInput
            id="outlined-adornment-weight"
            endAdornment={
              <InputAdornment position="end">Hora salida</InputAdornment>
            }
            aria-describedby="outlined-weight-helper-text"
            inputProps={{
              "aria-label": "weight",
            }}
            className="inputViaje"
            type="time"
            required
            onChange={(e) => setHoraSalida(e.target.value)}
          />
          <OutlinedInput
            id="outlined-adornment-weight"
            endAdornment={
              <InputAdornment position="end">Hora Llegada</InputAdornment>
            }
            aria-describedby="outlined-weight-helper-text"
            inputProps={{
              "aria-label": "weight",
            }}
            className="inputViaje"
            type="time"
            required
            onChange={(e) => setHoraLlegada(e.target.value)}
          />
        </div>
        <div className="fila">
          <OutlinedInput
            id="outlined-adornment-weight"
            endAdornment={
              <InputAdornment position="end">Fecha Salida</InputAdornment>
            }
            aria-describedby="outlined-weight-helper-text"
            inputProps={{
              "aria-label": "weight",
            }}
            className="inputViaje"
            type="date"
            required
            onChange={(e) => setfFechaSalida(e.target.value)}
          />
          <OutlinedInput
            id="outlined-adornment-weight"
            endAdornment={
              <InputAdornment position="end">Fecha Llegada</InputAdornment>
            }
            aria-describedby="outlined-weight-helper-text"
            inputProps={{
              "aria-label": "weight",
            }}
            className="inputViaje"
            type="date"
            required
            onChange={(e) => setfechaLlegada(e.target.value)}
          />
          <OutlinedInput
            id="outlined-adornment-weight"
            endAdornment={
              <InputAdornment position="end">$ Precio</InputAdornment>
            }
            aria-describedby="outlined-weight-helper-text"
            inputProps={{
              "aria-label": "weight",
            }}
            className="inputViaje"
            required
            onChange={(e) => setPrecio(e.target.value)}
          />
        </div>
      </form>
      <div className="btnContainer">
        <Button
          size="medium"
          className="btn"
          variant="contained"
          onClick={handleSubmit}
        >
          Crear viaje
        </Button>
      </div>
    </div>
  );
};

export default CreateTravelForm;
