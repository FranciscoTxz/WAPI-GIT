import React, { useState, useEffect } from "react";
import "./ticket.scss";

import OutlinedInput from "@mui/material/OutlinedInput";
import InputAdornment from "@mui/material/InputAdornment";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import Button from "@mui/material/Button";

import { db } from "../../../firebase";
import { doc, getDoc, setDoc } from "firebase/firestore";

import { useParams } from "react-router-dom";

import { useNavigate } from "react-router-dom";

const Ticket = () => {
  const navigate = useNavigate();
  const [data, setData] = useState([]);
  const [estado, setEstado] = useState(null);
  const [categoria, setCategoria] = useState(null);
  const [asientos, setasientos] = useState(null);
  const [nombrePasajeros, setnombrePasajeros] = useState(null);

  const { idBoleto } = useParams();

  useEffect(() => {
    const fetchData = async () => {
      if (idBoleto !== null) {
        try {
          // Obtener referencia al documento
          const viajeDocRef = doc(db, "boletos", idBoleto);

          // Obtener los datos del documento
          const docSnap = await getDoc(viajeDocRef);

          if (docSnap.exists()) {
            // El documento existe, por lo tanto, obtén los datos y configúralos en el estado
            setData({ id: docSnap.id, ...docSnap.data() });

            // Establecer los estados basados en los datos recuperados
            setEstado(docSnap.data().estado);
            setCategoria(docSnap.data().categoria);
            setasientos(docSnap.data().seat);
            setnombrePasajeros(docSnap.data().passengerNames);
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
  }, [idBoleto]);

  const handleUpdateTicket = async (e) => {
    e.preventDefault(); // Evitar la recarga de la página por defecto
    try {
      const viajeDocRef = doc(db, "boletos", idBoleto);

      // Obtener los datos del documento
      const docSnap = await getDoc(viajeDocRef);

      await setDoc(doc(db, "boletos", idBoleto), {
        ...docSnap.data(),
        categoria: categoria,
        estado: estado,
        passengerNames: nombrePasajeros,
        seat: asientos,
      });

      const response = await fetch(
        `https://actualizarobjeto-klapxs6vqa-uc.a.run.app?id=${idBoleto}&cñ=Prueba1234`
      );
      if (!response.ok) {
        throw new Error(`Error al obtener el objeto: ${response.status}`);
      }
      const data = await response.json();
      console.log(data);

      const responseApple = await fetch(
        `https://crearboletoapple-klapxs6vqa-uc.a.run.app?id=${idBoleto}&cñ=Prueba1234`
      );
      if (!responseApple.ok) {
        throw new Error(`Error al obtener el objeto: ${responseApple.status}`);
      }

      const dataApple = await responseApple.json();
      console.log(dataApple);
      alert("Boleto actualizado");

      //mandar mail y whatsapp
      const responseMail = await fetch(
        `https://mandarmail-klapxs6vqa-uc.a.run.app?id=${idBoleto}&cñ=Prueba1234&tipo=2`
      );
      if (!responseMail.ok) {
        throw new Error(`Error al enviar el mensaje: ${responseMail.status}`);
      }
      const dataM = await responseMail.json();
      console.log(dataM);

      //Enviar whatsapp
      const responseWhatsapp = await fetch(
        `https://mandarwhats-klapxs6vqa-uc.a.run.app?id=${idBoleto}&tipo=2&cñ=Prueba1234`
      );
      if (!responseWhatsapp.ok) {
        throw new Error(
          `Error al enviar el mensaje: ${responseWhatsapp.status}`
        );
      }
      const dataW = await responseWhatsapp.json();
      console.log(dataW);
      alert("Cliente avisado por correo y whatsapp");
      navigate(-1);
    } catch (error) {
      console.log(error);
    }
  };

  const handleExpireTicket = async () => {
    const response = await fetch(
      `https://expirarobjeto-klapxs6vqa-uc.a.run.app?id=${idBoleto}&cñ=Prueba1234`
    );

    if (!response.ok) {
      throw new Error(`Error al obtener el objeto: ${response.status}`);
    }

    const data = await response.json();
    console.log(data);
    alert("Boleto expirado");
    navigate(-1);
  };

  if (data !== null) {
    return (
      <div className="ticket">
        <div className="container">
          <div className="title">
            <h2>Boleto con ID: {idBoleto}</h2>
            <span onClick={() => navigate(-1)}>
              <ArrowBackIcon />
            </span>
          </div>

          <div className="inputContainer">
            <form onSubmit={handleUpdateTicket}>
              <div className="data1">
                <OutlinedInput
                  id="outlined-adornment-weight"
                  endAdornment={
                    <InputAdornment position="end">Estado</InputAdornment>
                  }
                  aria-describedby="outlined-weight-helper-text"
                  inputProps={{
                    "aria-label": "weight",
                  }}
                  required
                  value={estado ?? data.estado}
                  onChange={(e) => setEstado(e.target.value)}
                />
                <OutlinedInput
                  id="outlined-adornment-weight"
                  endAdornment={
                    <InputAdornment position="end">Categoria</InputAdornment>
                  }
                  aria-describedby="outlined-weight-helper-text"
                  inputProps={{
                    "aria-label": "weight",
                  }}
                  required
                  value={categoria ?? data.categoria}
                  onChange={(e) => setCategoria(e.target.value)}
                />
                <OutlinedInput
                  id="outlined-adornment-weight"
                  endAdornment={
                    <InputAdornment position="end">Asientos</InputAdornment>
                  }
                  aria-describedby="outlined-weight-helper-text"
                  inputProps={{
                    "aria-label": "weight",
                  }}
                  required
                  value={asientos ?? data.seat}
                  onChange={(e) => setasientos(e.target.value)}
                />
                <OutlinedInput
                  id="outlined-adornment-weight"
                  endAdornment={
                    <InputAdornment position="end">Pasajeros</InputAdornment>
                  }
                  aria-describedby="outlined-weight-helper-text"
                  inputProps={{
                    "aria-label": "weight",
                  }}
                  required
                  value={nombrePasajeros ?? data.passengerNames}
                  onChange={(e) => setnombrePasajeros(e.target.value)}
                />
                <Button variant="contained" color="success" type="submit">
                  Success
                </Button>
                <Button
                  variant="contained"
                  color="error"
                  onClick={handleExpireTicket}
                >
                  Expirar
                </Button>
              </div>
            </form>
          </div>
        </div>
      </div>
    );
  }
};

export default Ticket;
