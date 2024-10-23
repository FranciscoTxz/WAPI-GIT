import React, { useState, useContext } from "react";
import "./login.scss";

import MinimizeIcon from "@mui/icons-material/Minimize";
import TextField from "@mui/material/TextField";
import Button from "@mui/material/Button";
import { useNavigate, Link } from "react-router-dom";

import { auth } from "../../../firebase";
import { signInWithEmailAndPassword } from "firebase/auth";

import { AuthContext } from "../../../context/AuthContext";

const Login = () => {
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [pass, setPass] = useState("");
  const [error, setError] = useState(false);

  const { dispatch } = useContext(AuthContext);

  const handleLogin = (e) => {
    e.preventDefault();
    signInWithEmailAndPassword(auth, email, pass)
      .then((userCredential) => {
        const user = userCredential.user;
        dispatch({ type: "LOGIN", payload: user });
        if (user.email === "rsp_63@hotmail.com") {
          navigate("/admin");
        } else {
          navigate("/");
        }
      })
      .catch((error) => {
        setError(error);
      });
  };

  return (
    <div className="login">
      <div className="wrapper">
        <div className="inputContainer">
          <h1 className="title">Bienvenido de nuevo</h1>
          <form onSubmit={handleLogin}>
            <TextField
              id="email"
              label="Correo electronico"
              variant="outlined"
              required
              type="email"
              className="txt"
              size="small"
              onChange={(e) => setEmail(e.target.value)}
            />
            <TextField
              id="password"
              label="Contraseña"
              variant="outlined"
              required
              type="password"
              className="txt"
              size="small"
              onChange={(e) => setPass(e.target.value)}
            />

            <Button
              size="medium"
              className="btn"
              variant="contained"
              type="submit"
            >
              Iniciar Sesión
            </Button>
            <h5>
              ¿No tienes cuenta?
              <Link to="/signup" style={{ color: "black" }}>
                <span>Registrate</span>
              </Link>
            </h5>
            <span>{error ? error.message : null}</span>
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

export default Login;
