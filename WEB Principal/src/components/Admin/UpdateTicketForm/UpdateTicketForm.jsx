import React, { useState } from "react";
import "./updateTicketForm.scss";
import { useNavigate } from "react-router-dom";

//Material UI
import TextField from "@mui/material/TextField";
import Button from "@mui/material/Button";

export const UpdateTicketForm = () => {
  const navigate = useNavigate();
  const [idBoleto, setIdBoleto] = useState(null);

  return (
    <div className="ticket">
      <form
        onSubmit={() => navigate(`/admin/ticket/${idBoleto}`)}
        style={{
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          flexDirection: "column",
          gap: "5px",
        }}
      >
        <div className="datos">
          <label htmlFor="">Ingresa el ID del boleto:</label>
          <TextField
            id="outlined-basic"
            label="ID de boleto"
            variant="outlined"
            className="inputID"
            required
            onChange={(e) => setIdBoleto(e.target.value)}
          />
        </div>
        <Button variant="contained" color="success" type="submit">
          Buscar
        </Button>
      </form>
    </div>
  );
};
