import React from 'react';
import { useNavigate } from 'react-router-dom';
import '../styles/MainPage.css';
import BoletoAppleP from '../assets/BoletoAppleP.png';
import Top from '../assets/top.jpeg';

const MainPage = () => {
    const navigate = useNavigate();

    const handleClick = () => {
        navigate("/ticket");
    };

    return (
        <div className="main-page">
            <div className="top-container">
                <img src={Top} alt="Imagen1" />
            </div>
            <div className="image-container" onClick={handleClick}>
                <img src={BoletoAppleP} alt="Imagen2" />
            </div>
        </div>
    );
};

export default MainPage;