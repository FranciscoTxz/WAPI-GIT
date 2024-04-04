import React, { useState } from "react";
import "./signup.scss";

import MinimizeIcon from "@mui/icons-material/Minimize";
import TextField from "@mui/material/TextField";
import Button from "@mui/material/Button";
import { useNavigate, Link } from "react-router-dom";

import { auth } from "../../../firebase";
import { createUserWithEmailAndPassword } from "firebase/auth";

import { db } from "../../../firebase";
import { doc, setDoc } from "firebase/firestore";

const SignUp = () => {
  const navigate = useNavigate();

  const [email, setEmail] = useState("");
  const [contraseña, setContraseña] = useState("");
  const [repetirContraseña, setRepetirContraseña] = useState("");
  const [registrado, setRegistrado] = useState(false);
  const [error, setError] = useState(null);
  const [nombre, setNombre] = useState("");
  const [telefono, settelefono] = useState("");

  const handleInputChange = (e, setter) => {
    setter(e.target.value);
  };

  const crearUsuario = async (e) => {
    e.preventDefault();

    try {
      if (contraseña.length < 6 || repetirContraseña.length < 6) {
        setError("La contraseña debe tener 6 o mas caracteres");
        return;
      } else if (contraseña === repetirContraseña) {
        setRegistrado(true);
        if (telefono !== "") {
          const response = await createUserWithEmailAndPassword(
            auth,
            email,
            contraseña
          );

          // console.log(response);
          await setDoc(doc(db, "usuarios", response.user.uid), {
            contraseña: contraseña,
            correo: email,
            nombre: nombre,
            numero: telefono,
          });
          navigate("/login");
        }
      } else {
        setError("Usuario registrado / la contraseña no coincide");
        return;
      }
    } catch (error) {
      console.log(error);
    }
  };

  const data = [
    {
      id: "email",
      label: "Correo electrónico",
      type: "email",
      variant: "outlined",
      required: true,
      className: "txt",
      size: "small",
      onChange: (e) => handleInputChange(e, setEmail),
    },
    {
      id: "password",
      label: "Contraseña",
      type: "password",
      variant: "outlined",
      required: true,
      className: "txt",
      size: "small",
      onChange: (e) => handleInputChange(e, setContraseña),
    },
    {
      id: "password2",
      label: "Repetir contraseña",
      type: "password",
      variant: "outlined",
      required: true,
      className: "txt",
      size: "small",
      onChange: (e) => handleInputChange(e, setRepetirContraseña),
    },
  ];

  return (
    <div className="signUp">
      <div className="wrapper">
        <div className="inputContainer">
          <h1 className="title">Crea tu cuenta </h1>
          <form onSubmit={crearUsuario}>
            {data.map((data) => (
              <TextField
                id={data.id}
                label={data.label}
                variant={data.variant}
                required
                type={data.type}
                className={data.className}
                size={data.size}
                onChange={data.onChange}
              />
            ))}
            {registrado && (
              <>
                <TextField
                  id="nombre"
                  label="Nombre Completo"
                  variant="outlined"
                  required
                  type="text"
                  className="txt"
                  size="small"
                  onChange={(e) => setNombre(e.target.value)}
                />
                <TextField
                  id="numero"
                  label="Numero"
                  variant="outlined"
                  required
                  type="text"
                  className="txt"
                  size="small"
                  onChange={(e) => settelefono(e.target.value)}
                />
              </>
            )}
            <Button
              size="medium"
              className="btn"
              variant="contained"
              type="submit"
            >
              Registrarse
            </Button>
            <span className="error">{error}</span>
            <h5>
              ¿Ya tienes cuenta?
              <Link to="/login" style={{ color: "black" }}>
                <span>Inicia Sesión</span>
              </Link>
            </h5>
          </form>
          <div className="terms">
            <h6>Teminos y condiciones</h6>
            <MinimizeIcon className="icon" />
            <h6>Avisos de privacidad</h6>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SignUp;
