import './PrimeraSeccion.css';
import { db } from "../firebase/firebaseconfig";
import {doc, updateDoc } from "firebase/firestore";
export const PrimeraSeccion = ({ id, dataB, dataV, dataU, dataP }) => {
  
  const handleClick = async () => {
    console.log(dataB.estado)
    console.log(id)

    try {
      const documentoRef = doc(db, "boletos", id);
      await updateDoc(documentoRef, {
        estado: 'Abordado'
      });
      console.log("Estado actualizado correctamente.");
    } catch (error) {
      console.error("Error al actualizar el estado:", error);
    }
    //Mandar Whatsapp de "Disfruta tu viaje" ... Proximamente
    alert('Boleto marcado como Abordado');
    window.location.reload();
  }

  if (dataB === '') {
    return (
      <div>---</div>
    )
  }
  else if (dataB === 'error') {
    return (
      <div className="error">No se encontro el boleto</div>
    )
  }
  else {
    return (
      <div className="container">
        <div className="titlex">Datos del Boleto</div>
        <div className="info">
          <div className="infoItem">
            <span className='subTitle'>Estado Boleto:</span>
            <span className='infoFinx'>{dataB.estado}</span>
          </div>
          <div className="infoItem">
            <span className='subTitle'>Nombres Pasajeros:</span>
            <span className='infoFin'>{dataB.passengerNames}</span>
          </div>
          <div className="infoItem">
            <span className='subTitle'>Categoría:</span>
            <span className='infoFin'>{dataB.categoria}</span>
          </div>
          <div className="infoItem">
            <span className='subTitle'>Asientos:</span>
            <span className='infoFin'>{dataB.seat}</span>
          </div>
        </div>

        <div className="titlex">Datos del Viaje</div>
        <div className="info">
          <div className="infoItem">
            <span className='subTitle'>Origen:</span>
            <span className='infoFin'>{`${dataV.originName}, ${dataV.originStationCode}`}</span>
          </div>
          <div className="infoItem">
            <span className='subTitle'>Destino:</span>
            <span className='infoFin'>{`${dataV.destinationName}, ${dataV.destinationStationCode} `}</span>
          </div>
          <div className="infoItem">
            <span className='subTitle'>Fecha y Hora de Salida:</span>
            <span className='infoFin'>{dataV.departureDateTime}</span>
          </div>
          <div className="infoItem">
            <span className='subTitle'>Fecha y Hora de Llegada:</span>
            <span className='infoFin'>{dataV.arrivalDateTime}</span>
          </div>
          <div className="infoItem">
            <span className='subTitle'>Carro:</span>
            <span className='infoFin'>{dataV.carriage}</span>
          </div>
          <div className="infoItem">
            <span className='subTitle'>Zona:</span>
            <span className='infoFin'>{dataV.zone}</span>
          </div>
        </div>

        <div className="titlex">Datos del Usuario</div>
        <div className="info">
          <div className="infoItem">
            <span className='subTitle'>Nombre:</span>
            <span className='infoFin'>{dataU.nombre}</span>
          </div>
          <div className="infoItem">
            <span className='subTitle'>Correo:</span>
            <span className='infoFin'>{dataU.correo}</span>
          </div>
        </div>
        
        <div className="titlex">Datos del Pago</div>
        <div className="info">
          <div className="infoItem">
            <span className='subTitle'>Metodo de Pago:</span>
            <span className='infoFin'>{dataP.metodo_pago}</span>
          </div>
          <div className="infoItem">
            <span className='subTitle'>Precio:</span>
            <span className='infoFin'>{dataV.precio}</span>
          </div>
        </div>
        <div className="info">
        <button className='bx' onClick={handleClick}>Abordado</button>
        </div>
      </div>
    )
  }
}