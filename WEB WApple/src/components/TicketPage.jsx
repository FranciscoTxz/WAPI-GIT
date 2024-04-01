import React from 'react';
import { useNavigate } from 'react-router-dom';
import '../styles/TicketPage.css';
import BoletoApple from '../assets/BoletoApple.png';
import Compartir from '../assets/compartir.png';
import TresPuntos from '../assets/tres-puntos.png';

const TicketPage = () => {
    const navigate = useNavigate();

    const handleClick = () => {
        navigate(-1);
    }

    const handleClick2 = () => {
        navigate("/ticket-breakdown");
    }

    return (
        <div className="ticket-page">
            <div id="botones-arriba" className="button-container">
                <button className="buttonx" onClick={handleClick}>Listo</button>
                <div>
                    <img src={Compartir} alt="Boton 1" className='button'/>
                    <img src={TresPuntos} alt="Boton 2"  className='button' onClick={handleClick2}/>
                    {/* <button className="button">Botón 1</button>
                    <button className="button">Botón 2</button> */}
                </div>
            </div>
            <div className="image-container">
                <img src={BoletoApple} alt="Imagen2" />
            </div>
        </div>
    );
};

export default TicketPage;