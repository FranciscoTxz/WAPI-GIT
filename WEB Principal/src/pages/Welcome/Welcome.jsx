import React from "react";
import "./welcome.scss";

import { useNavigate } from "react-router-dom";

import img from "../../assets/undraw_travelers_re_y25a.svg";

const Welcome = () => {
  const navigate = useNavigate();

  const goToSignUp = () => {
    navigate("/signup");
  };

  const goToLogIn = () => {
    navigate("/login");
  };

  return (
    <div className="welcome">
      <h1 className="main">WAPI</h1>
      <div className="welcomeContainer">
        <div className="logoContainer">
          <h2 className="text"> TRABAJAMOS PARA MOVERNOS CONTIGO</h2>
          <img src={img} alt="" className="logo" />
        </div>
        <div className="wrapper">
          <h1 className="title">Comienza aquí</h1>
          <div className="botones">
            <button className="btnLogin" onClick={goToLogIn}>
              Inicia sesion
            </button>
            <button className="btnSign" onClick={goToSignUp}>
              Registrarse
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Welcome;
