import { useState } from "react";
import { PrimeraSeccion } from "../PrimeraSeccion/PrimeraSeccion";
import "./Section.css";
import { db } from "../firebase/firebaseconfig";
import { doc, getDoc } from "firebase/firestore";
//leer valores y escribirlos en la pagina

export const Section = () => {

    const [inputValue, setInputValue] = useState('')
    const [dataBoletos, setDataBoletos] = useState('');
    const [dataViajes, setDataViajes] = useState('');
    const [dataUsuarios, setDataUsuarios] = useState('');
    const [dataPagos, setDataPagos] = useState('');

    const handleInputChange = (e) => {
        setInputValue(e.target.value)
    }

    const handleClick = async () => {
        let valorGuardado = inputValue;
        console.log('Valor Guardado:', valorGuardado)

        setInputValue('');

        if (valorGuardado === '') {
            console.log('No hay valor');
            return;
        }

        const docRefBoletos = doc(db, "boletos", `${valorGuardado}`);
        const docBoletos = await getDoc(docRefBoletos);
        if (docBoletos.exists()) {
        } else { 
            setDataBoletos('error');
            return; }
        
        const docRefViajes = doc(db, "viajes", `${docBoletos.data().id_viaje}`);
        const docViajes = await getDoc(docRefViajes);

        const docRefUsuarios = doc(db, "usuarios", `${docBoletos.data().usuario}`);
        const docUsuarios = await getDoc(docRefUsuarios);

        const docRefPagos = doc(db, "pagos", `${docBoletos.data().purchaseReceiptNumber}`);
        const docPagos = await getDoc(docRefPagos);

        setDataBoletos(docBoletos.data());
        setDataViajes(docViajes.data());
        setDataUsuarios(docUsuarios.data());
        setDataPagos(docPagos.data());
    }

    return (
        <section>
            <h1 className="titulo">Ingresa el valor del boleto o escanealo</h1>
            <input className="input" type="text" value={inputValue} onChange={handleInputChange} placeholder="ID del Boleto" />
            <button className="boton" onClick={handleClick}>Consultar Boleto</button>
            <PrimeraSeccion dataB={dataBoletos} dataV={dataViajes} dataU={dataUsuarios} dataP={dataPagos}/>
        </section>
    )
}

//flaticon iconos padres
