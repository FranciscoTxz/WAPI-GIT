import React, { useState, useEffect } from "react";
import "./tabsSalidasADM.scss";
import Asientos from "../Salidas/AsientosCom/Asientos";
import DatosPasajero from "../Salidas/DatosPasajeroCom/DatosPasajero";
import MetodoPago from "../Salidas/MetodoPagoCom/MetodoPago";

const Tabs = ({ config, activeTab, setActiveTab }) => {
  return (
    <div className="TabsMain">
      <div className="tabsContent">
        <div className="cardDiv">
          <div className="tab">
            <div className="tab-headers">
              {config.map((entry, index) => (
                <div
                  className={`tab-header ${
                    activeTab === index ? "active" : ""
                  }`}
                  //Accion para activar o desactivar el funcionamineto de las tabs
                  //onClick={() => setActiveTab(index)}
                >
                  {entry.header}
                </div>
              ))}
            </div>
            <div className="tab-body">{config[activeTab].component}</div>
          </div>
        </div>
      </div>
    </div>
  );
};

function TabsSalidasADM({ precio, id }) {
  const [activeTab, setActiveTab] = useState(0);
  const [selectedSeats, setSelectedSeats] = useState(null); // Cambiado a null
  const [firstPassengerData, setFirstPassengerData] = useState(null);
  useEffect(() => {
    // Aquí puedes acceder a firstPassengerData cuando cambie
    console.log("firstPassengerData actualizado:", firstPassengerData);
  }, [firstPassengerData]);

  const handleFirstPassengerRegistered = (datosPasajero) => {
    setFirstPassengerData(datosPasajero);

    console.log(datosPasajero);
  };
  const handleNextDataPassenger = (seatNumber) => {
    setSelectedSeats(seatNumber);
    setActiveTab(1);
  };

  const handleNextPay = () => {
    setActiveTab(2);
  };

  return (
    <Tabs
      config={[
        {
          header: "Asientos",
          component: <Asientos onNextTab={handleNextDataPassenger} />,
        },
        {
          header: "Datos de Pasajero(s)",
          component: (
            <DatosPasajero
              onNextTab={handleNextPay}
              onFirstPassengerRegistered={handleFirstPassengerRegistered}
              selectedSeats={selectedSeats}
            />
          ),
        },
        {
          header: "Método de pago",
          component: (
            <MetodoPago
              firstPassengerData={firstPassengerData}
              precio={precio}
              asientos={selectedSeats}
              id={id}
            />
          ),
        },
      ]}
      activeTab={activeTab}
      setActiveTab={setActiveTab}
    />
  );
}

export default TabsSalidasADM;
