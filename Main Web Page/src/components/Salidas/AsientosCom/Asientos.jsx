import React, { useState } from "react";
import "./asientos.scss";
import img from "../../../assets/Bus.png";

const Asientos = ({ onNextTab }) => {
  //Para el carddiv que muestra los asientos seleccionado
  const [asientosSeleccionados, setAsientosSeleccionados] = useState([]);

  const handleSeleccionAsiento = (event) => {
    const asiento = event.target.innerText;
    //Cambio de color en el boton seleccionado
    event.target.classList.toggle("button-item-selected");

    // Verificar si el asiento ya está seleccionado
    if (!asientosSeleccionados.includes(asiento)) {
      // Agregar el asiento seleccionado al estado
      setAsientosSeleccionados([...asientosSeleccionados, asiento]);
    } else {
      // Se elimina el asiento si ya está seleccionado
      setAsientosSeleccionados(
        asientosSeleccionados.filter((item) => item !== asiento)
      );
    }
  };

  //Envia los asientos seleccionados a la pagina asientos para mapearlos
  //y mostrar un form por cada pasajero
  const handleGoToDataPassenger = () => {
    if (asientosSeleccionados.length > 0) {
      console.log("Asientos Seleccionados:", asientosSeleccionados);
      onNextTab(asientosSeleccionados); // Pasar todos los asientos seleccionados
    } else {
      alert("Por favor, selecciona al menos un asiento antes de continuar.");
    }
  };

  return (
    <div className="content-asientos">
      <div className="HeaderAsientos">
        <h1>Tus asientos</h1>
        <p>
          Elige los asientos que necesites, en seguida te solicitaremos los
          datos de los pasajeros.
        </p>
      </div>
      <div className="division">
        <div className="content-seleccion">
          <div className="labelasientos">
            <div className="disponible">
              <button className="botonDis">00</button>
              <label className="labelDis">Disponible</label>
            </div>
            <div className="seleccionado">
              <button className="botonSelec">00</button>
              <label className="labelSelec">Seleccionado</label>
            </div>
            <div className="ocupado">
              <button className="botonOcup">00</button>
              <label className="labelOcup">Ocupado</label>
            </div>
          </div>
          <div className="asientos">
            <div className="card-asientos">
              <lu className="grid-asientos">
                <p>
                  <img src={img} alt="" className="icon"></img>
                </p>
                <div className="column-row1">
                  <li>
                    <button
                      className="button-item"
                      onClick={handleSeleccionAsiento}
                    >
                      1
                    </button>
                  </li>
                  <li>
                    <button
                      className="button-item"
                      onClick={handleSeleccionAsiento}
                    >
                      2
                    </button>
                  </li>
                  <li className="lispace">
                    <button className="button-space"></button>
                  </li>
                  <li>
                    <button
                      className="button-item"
                      onClick={handleSeleccionAsiento}
                    >
                      3
                    </button>
                  </li>
                  <li>
                    <button
                      className="button-item"
                      onClick={handleSeleccionAsiento}
                    >
                      4
                    </button>
                  </li>
                </div>
                <div className="column-row-2">
                  <li>
                    <button
                      className="button-item"
                      onClick={handleSeleccionAsiento}
                    >
                      5
                    </button>
                  </li>
                  <li>
                    <button
                      className="button-item"
                      onClick={handleSeleccionAsiento}
                    >
                      6
                    </button>
                  </li>
                  <li className="lispace">
                    <button className="button-space"></button>
                  </li>
                  <li>
                    <button
                      className="button-item"
                      onClick={handleSeleccionAsiento}
                    >
                      7
                    </button>
                  </li>
                  <li>
                    <button
                      className="button-item"
                      onClick={handleSeleccionAsiento}
                    >
                      8
                    </button>
                  </li>
                </div>
                <div className="column-row3">
                  <li>
                    <button
                      className="button-item"
                      onClick={handleSeleccionAsiento}
                    >
                      9
                    </button>
                  </li>
                  <li>
                    <button
                      className="button-item"
                      onClick={handleSeleccionAsiento}
                    >
                      10
                    </button>
                  </li>
                  <li className="lispace">
                    <button className="button-space"></button>
                  </li>
                  <li>
                    <button
                      className="button-item"
                      onClick={handleSeleccionAsiento}
                    >
                      11
                    </button>
                  </li>
                  <li>
                    <button
                      className="button-item"
                      onClick={handleSeleccionAsiento}
                    >
                      12
                    </button>
                  </li>
                </div>
                <div className="column-row4">
                  <li>
                    <button
                      className="button-item"
                      onClick={handleSeleccionAsiento}
                    >
                      13
                    </button>
                  </li>
                  <li>
                    <button
                      className="button-item"
                      onClick={handleSeleccionAsiento}
                    >
                      14
                    </button>
                  </li>
                  <li className="lispace">
                    <button className="button-space"></button>
                  </li>
                  <li>
                    <button
                      className="button-item"
                      onClick={handleSeleccionAsiento}
                    >
                      15
                    </button>
                  </li>
                  <li>
                    <button
                      className="button-item"
                      onClick={handleSeleccionAsiento}
                    >
                      16
                    </button>
                  </li>
                </div>
                <div className="column-row5">
                  <li>
                    <button
                      className="button-item"
                      onClick={handleSeleccionAsiento}
                    >
                      17
                    </button>
                  </li>
                  <li>
                    <button
                      className="button-item"
                      onClick={handleSeleccionAsiento}
                    >
                      18
                    </button>
                  </li>
                  <li className="lispace">
                    <button className="button-space"></button>
                  </li>
                  <li>
                    <button
                      className="button-item"
                      onClick={handleSeleccionAsiento}
                    >
                      19
                    </button>
                  </li>
                  <li>
                    <button
                      className="button-item"
                      onClick={handleSeleccionAsiento}
                    >
                      20
                    </button>
                  </li>
                </div>
                <div className="column-row6">
                  <li>
                    <button
                      className="button-item"
                      onClick={handleSeleccionAsiento}
                    >
                      21
                    </button>
                  </li>
                  <li>
                    <button
                      className="button-item"
                      onClick={handleSeleccionAsiento}
                    >
                      22
                    </button>
                  </li>
                  <li className="lispace">
                    <button className="button-space"></button>
                  </li>
                  <li>
                    <button
                      className="button-item"
                      onClick={handleSeleccionAsiento}
                    >
                      23
                    </button>
                  </li>
                  <li>
                    <button
                      className="button-item"
                      onClick={handleSeleccionAsiento}
                    >
                      24
                    </button>
                  </li>
                </div>
                <div className="column row7">
                  <li>
                    <button
                      className="button-item"
                      onClick={handleSeleccionAsiento}
                    >
                      25
                    </button>
                  </li>
                  <li>
                    <button
                      className="button-item"
                      onClick={handleSeleccionAsiento}
                    >
                      26
                    </button>
                  </li>
                  <li className="lispace">
                    <button
                      className="button-space"
                      onClick={handleSeleccionAsiento}
                    ></button>
                  </li>
                  <li>
                    <button
                      className="button-item"
                      onClick={handleSeleccionAsiento}
                    >
                      27
                    </button>
                  </li>
                  <li>
                    <button
                      className="button-item"
                      onClick={handleSeleccionAsiento}
                    >
                      28
                    </button>
                  </li>
                </div>
                <div className="column-row8">
                  <li>
                    <button
                      className="button-item"
                      onClick={handleSeleccionAsiento}
                    >
                      29
                    </button>
                  </li>
                  <li className="lispace">
                    <button className="button-space"></button>
                  </li>
                  <li className="lispace">
                    <button className="button-space"></button>
                  </li>
                  <li className="lispace">
                    <button className="button-space"></button>
                  </li>
                  <li>
                    <button
                      className="button-item"
                      onClick={handleSeleccionAsiento}
                    >
                      30
                    </button>
                  </li>
                </div>
              </lu>
            </div>
          </div>
        </div>
      </div>

      <h2>Asientos Seleccionados</h2>
      <div className="cardSelec">
        {asientosSeleccionados.map((asiento, index) => (
          <div className="content-selec" key={index}>
            <div className="spacebtn">
              <button className="BoletoSelec">{asiento}</button>
            </div>
          </div>
        ))}
      </div>
      <div className="btnpassengers">
        <button
          className="handleGoToPassengers"
          onClick={handleGoToDataPassenger}
        >
          Siguiente
        </button>
      </div>
    </div>
  );
};
export default Asientos;
