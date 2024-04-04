import React, { useContext, useState } from "react";
import "./navbar.scss";
import GridOnIcon from "@mui/icons-material/GridOn";
import CancelIcon from "@mui/icons-material/Cancel";
import logo from "../../../assets/Conecta-01.png";
import LogoutIcon from "@mui/icons-material/Logout";
import AccountCircleIcon from "@mui/icons-material/AccountCircle";
import { AuthContext } from "../../../context/AuthContext";
import { useNavigate } from "react-router";

const Navbar = () => {
  //Variables
  const navigate = useNavigate();
  const [active, setActive] = useState("navBar");

  //Nos permite hacer logOut
  const { dispatch } = useContext(AuthContext);

  //Nos permite obtener el usuario loggeado actual
  const { currentUser } = useContext(AuthContext);

  //funcion para desplegar el navegador
  const showNav = () => {
    setActive("navBar activeNavbar");
  };
  //funcion para desactivar el nav
  const removeNav = () => {
    setActive("navBar");
  };

  //Función que hace logOut al usuario actual
  const handleLogOut = () => {
    try {
      dispatch({ type: "LOGOUT", payload: currentUser });
    } catch (error) {
      console.log(error);
    }
  };

  const handleGoToHistory = () => {
    navigate("/history");
  };

  return (
    <section className="navBarSection">
      <header className="header flex">
        <div className="logoDiv">
          <a href="#" className="logo flex">
            <h1>
              <img src={logo} alt="" className="icon" />
            </h1>
          </a>
        </div>

        <div className={active}>
          <ul className="navLists flex">
            <li className="navItem">
              <a href="#" className="navLink">
                Información
              </a>
            </li>
            <li className="navItem">
              <a href="#" className="navLink">
                Nosotros
              </a>
            </li>
            <li className="navItem">
              <a href="#" className="navLink">
                Boletos
              </a>
            </li>
            <li className="navItem">
              <a href="#" className="navLink">
                Califícanos
              </a>
            </li>
            <li className="navItem">
              <a href="#" className="navLink">
                Contáctanos
              </a>
            </li>
            <li className="navItem" onClick={handleLogOut}>
              <a href="#" className="navLink">
                <LogoutIcon className="icon" />
              </a>
            </li>
            <li className="navItem" onClick={handleGoToHistory}>
              <a href="#" className="navLink">
                <AccountCircleIcon className="icon" />
              </a>
            </li>
          </ul>
          <div onClick={removeNav} className="closeNavbar">
            <CancelIcon className="icon" />
          </div>
        </div>

        <div onClick={showNav} className="toggleNavbar">
          <GridOnIcon className="icon" />
        </div>
      </header>
    </section>
  );
};

export default Navbar;
