import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import {
  doc,
  getDoc,
  getDocs,
  collection,
  where,
  query,
} from "firebase/firestore";
import { db } from "../../../firebase";

import { useNavigate } from "react-router-dom";

import OutlinedInput from "@mui/material/OutlinedInput";
import InputAdornment from "@mui/material/InputAdornment";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import Button from "@mui/material/Button";
import random from "random";

import InputLabel from "@mui/material/InputLabel";
import MenuItem from "@mui/material/MenuItem";
import FormControl from "@mui/material/FormControl";
import Select from "@mui/material/Select";

export const Travel = () => {
  const navigate = useNavigate();
  let { id } = useParams();
  const [data, setData] = useState(null);
  const [id_viaje, setId_viaje] = useState(id);
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

  useEffect(() => {
    const fetchData = async () => {
      if (id !== null) {
        try {
          // Obtener referencia al documento
          const viajeDocRef = doc(db, "viajes", id);

          // Obtener los datos del documento
          const docSnap = await getDoc(viajeDocRef);

          if (docSnap.exists()) {
            // El documento existe, por lo tanto, obtén los datos y configúralos en el estado
            setData({ id: docSnap.id, ...docSnap.data() });

            // Establecer los estados basados en los datos recuperados
            setOriginStationCode(docSnap.data().originStationCode);
            setDestinationStationCode(docSnap.data().destinationStationCode);
            setOriginName(docSnap.data().originName);
            setDestinationName(docSnap.data().destinationName);
            setZone(docSnap.data().zone);
            setCarriage(docSnap.data().carriage);
            setHoraSalida(docSnap.data().horaSalida);
            setHoraLlegada(docSnap.data().horaLlegada);
            setfFechaSalida(docSnap.data().fechaSalida);
            setfechaLlegada(docSnap.data().fechaLlegada);
            setPrecio(docSnap.data().precio);
          } else {
            // El documento no existe
            console.log("No existe ningún documento con el ID proporcionado.");
          }
        } catch (error) {
          console.error("Error al obtener el documento:", error);
        }
      }
    };

    fetchData(); // Llama a la función para obtener los datos cuando el componente se monta
  }, [id]);

  const handleUpdate = async () => {
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
        alert("Se actualizó satisfactoriamente");
      } catch (error) {
        console.log(error);
      }

      //Actualizar todos los boletos con la nueva información
      const boletosCollectionRef = collection(db, "boletos");
      const q = query(boletosCollectionRef, where("id_viaje", "==", id_viaje));
      await getDocs(q)
        .then((querySnapshot) => {
          querySnapshot.forEach(async (doc) => {
            // Por cada documento encontrado, imprime su ID
            console.log("ID del documento:", doc.id);

            try {
              // Actualizar los boletos
              const responseAc = await fetch(
                `https://actualizarobjeto-klapxs6vqa-uc.a.run.app?id=${doc.id}&cñ=${cñ}`
              );
              if (!responseAc.ok) {
                throw new Error(
                  `Error al obtener el objeto: ${responseAc.status}`
                );
              }
              const data = await responseAc.json();
              console.log(data);

              const responseApple = await fetch(
                `https://crearboletoapple-klapxs6vqa-uc.a.run.app?id=${doc.id}&cñ=Prueba1234`
              );
              if (!responseApple.ok) {
                throw new Error(
                  `Error al obtener el objeto: ${responseApple.status}`
                );
              }

              const dataApple = await responseApple.json();
              console.log(dataApple);

              //Enviar mail
              const responseMail = await fetch(
                `https://mandarmail-klapxs6vqa-uc.a.run.app?id=${doc.id}&cñ=${cñ}&tipo=2`
              );
              if (!responseMail.ok) {
                throw new Error(
                  `Error al enviar el mensaje: ${responseMail.status}`
                );
              }
              const dataM = await responseMail.json();
              console.log(dataM);

              //Enviar whatsapp
              const responseWhatsapp = await fetch(
                `https://mandarwhats-klapxs6vqa-uc.a.run.app?id=${doc.id}&tipo=2&cñ=${cñ}`
              );
              if (!responseWhatsapp.ok) {
                throw new Error(
                  `Error al enviar el mensaje: ${responseWhatsapp.status}`
                );
              }
              const dataW = await responseWhatsapp.json();
              console.log(dataW);
            } catch (error) {
              console.log(error);
            }
          });
          alert(
            "Se actuaizaron los boletos y se aviso a todos los clientes de esta actualización satisfactoriamente"
          );
          navigate(-1);
        })
        .catch((error) => {
          console.error("Error al buscar documentos:", error);
        });
    } else {
      alert("Necesitas llenar los datos para crear viajes");
    }
  };

  if (data !== null) {
    return (
      <div
        style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          height: "100vh",
          backgroundColor: "white",
        }}
      >
        <div className="createForm">
          <div className="title">
            <h2>Modificar viaje con ID: {data.id}</h2>
            <span style={{ cursor: "pointer" }} onClick={() => navigate(-1)}>
              <ArrowBackIcon />
            </span>
          </div>
          <hr />
          <form>
            <div className="fila">
              <FormControl fullWidth>
                <InputLabel id="demo-simple-select-label">
                  Codigo Origen
                </InputLabel>
                <Select
                  labelId="demo-simple-select-label"
                  id="demo-simple-select"
                  label="Age"
                  className="inputViaje"
                  value={originStationCode ?? data.originStationCode}
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
                  value={destinationStationCode ?? data.destinationStationCode}
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
                  value={originName ?? data.originName}
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
                  value={destinationName ?? data.destinationName}
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
                value={carriage ?? data.carriage}
                onChange={(e) => setCarriage(e.target.value)}
              />
              <OutlinedInput
                id="outlined-adornment-weight"
                endAdornment={
                  <InputAdornment position="end">Zone</InputAdornment>
                }
                aria-describedby="outlined-weight-helper-text"
                inputProps={{
                  "aria-label": "weight",
                }}
                className="inputViaje"
                required
                value={zone ?? data.zone}
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
                value={horaSalida ?? data.horaSalida}
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
                value={horaLlegada ?? data.horaLlegada}
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
                value={fechaSalida ?? data.fechaSalida}
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
                value={fechaLlegada ?? data.fechaLlegada}
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
                value={precio ?? data.precio}
                onChange={(e) => setPrecio(e.target.value)}
              />
            </div>
          </form>
          <div className="btnContainer">
            <Button
              size="medium"
              className="btn"
              variant="contained"
              onClick={handleUpdate}
            >
              Modificar viaje
            </Button>
          </div>
        </div>
      </div>
    );
  }
};
