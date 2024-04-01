import React from 'react';
import { useNavigate } from 'react-router-dom';
import '../styles/TicketBreakdownPage.css';
import Regresar from '../assets/regresar.png';
import Compartir from '../assets/compartir.png';
import Recreacion from '../assets/recreacion.png';


const TicketBreakdownPage = () => {
    const navigate = useNavigate();

    const handleClick = () => {
        navigate(-1);
    }


    return (
        <div className="ticket-pagex">
            <div id="botones-arribax" className="button-container">
                <img src={Regresar} alt="Boton 0" className='button0' onClick={handleClick} />
                <div>
                    <span className="wapi-text">WAPI</span>
                </div>
                <img src={Compartir} alt="Boton 1" className='button' />
            </div>
            <div className="image-containerx">
                <img src={Recreacion} alt="Imagen2" />
            </div>
            <div className='containerInfo'>
                <div className='infoExtra'>
                    <h2 className='titleInfo'>Pase de abordar</h2>
                    <p className='info1'>Presenta este boleto al encargado de la estación para que registre tu check-in.</p>
                    <hr className="separator" />
                    <div className='infoCont'>
                        <div class="izq">Número de boleto</div>
                        <div class="der">275</div>
                    </div>
                    <hr className="separator" />
                    <div className='infoCont'>
                        <div class="izq">Salida</div>
                        <div class="der">5 abr 2024, 01:00 pm</div>
                    </div>
                    <hr className="separator" />
                    <div className='infoCont'>
                        <div class="izq">Llegada</div>
                        <div class="der">5 abr 2024, 04:00 pm</div>
                    </div>
                    <hr className="separator" />
                    <div className='infoCont'>
                        <div class="izq">Zona</div>
                        <div class="der">Anden 1</div>
                    </div>
                    <hr className="separator" />
                    <div className='infoCont'>
                        <div class="izq">Número de recibo</div>
                        <div class="der">654321</div>
                    </div>
                    <hr className="separator" />
                    <div className='infoCont'>
                        <div class="izq">Precio</div>
                        <div class="der">550 MXN</div>
                    </div>
                    <hr className="separator" />
                    <div className='infoCont'>
                        <div class="izq">Metodo de pago</div>
                        <div class="der">PayPal</div>
                    </div>
                    <hr className="separator" />
                    <div className='infoCont'>
                        <div class="izq">Token de Facturación</div>
                        <div class="der">TOVA020718</div>
                    </div>
                    <hr className="separator" />
                    <div className='infoCont'>
                        <div class="izq">Categoría</div>
                        <div class="der">Adulto</div>
                    </div>
                    <hr className="separator" />
                    <div className='infoCont'>
                        <div class="izq">Estado del boleto</div>
                        <div class="der">Activo</div>
                    </div>
                    <hr className="separator" />
                    <div className='infoCont'>
                        <div class="izq">Telefono</div>
                        <a class="der" href='tel:4492013598'>4492013598</a>
                    </div>
                    <hr className="separator" />
                    <div className='infoCont'>
                        <div class="izq">Sitio web</div>
                        <a class="der" href='https://prueba-01x.web.app'>www.wapi.com</a>
                    </div>
                    <hr className="separator" />
                    <p className='izq' >Última actualización 05-04-2024 22:44</p>
                </div>
            </div>

        </div>
    );
};

export default TicketBreakdownPage;