import React from "react";
import "./footer.scss";
import FacebookIcon from "@mui/icons-material/Facebook";
import InstagramIcon from "@mui/icons-material/Instagram";
import XIcon from "@mui/icons-material/X";

const Footer = () => {
  return (
    <div className="footer">
      <div className="sb_footer_section_padding">
        <div className="sb_footer_links">
          <div className="sb_footer_links_div">
            <h3>Servicio al Cliente</h3>
            <a href="#">
              <p>Canje de boleto</p>
            </a>
            <a href="#">
              <p>Preguntas Frecuentes</p>
            </a>
            <a href="#">
              <p>Facturacion Electronica</p>
            </a>
            <a href="#">
              <p>Comentarios y Sugerencias</p>
            </a>
          </div>
          <div className="sb_footer_links_div">
            <h3>Sitios de interes</h3>
            <a href="#">
              <p>Renta de Autobuses</p>
            </a>
            <a href="#">
              <p>Unebus</p>
            </a>
            <a href="#">
              <p>Destinos Mexicos</p>
            </a>
          </div>
          <div className="sb_footer_links_div">
            <h3>Siguenos en nuestras redes</h3>
            <div className="socialmedia">
              <FacebookIcon />
              <InstagramIcon />
              <XIcon />
            </div>
            <p>Call Center</p>
            <p>+52 449 911 6832</p>
          </div>
        </div>
      </div>
      <div className="aviso_priv">
        Aviso de Privacidad - Todos los derechos reservados. WAPI AGS S.A de C.V
        2024
      </div>
    </div>
  );
};

export default Footer;
