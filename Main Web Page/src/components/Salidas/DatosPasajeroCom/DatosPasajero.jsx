import React, { useState } from "react";
import "./datosPasajero.scss";

//Funcion principal datos pasajero que obtiene la siguiente Tab, los asientos y
//pasajeros
const DatosPasajero = ({
  onNextTab,
  selectedSeats,
  onFirstPassengerRegistered,
}) => {
  //Variables
  const [formDataList, setFormDataList] = useState(
    Array.isArray(selectedSeats)
      ? selectedSeats.map((seat) => ({
          nombre: "",
          apellidoPaterno: "",
          apellidoMaterno: "",
          correo: "",
          categoria: "",
        }))
      : []
  );
  const [primerPasajeroRegistrado, setPrimerPasajeroRegistrado] =
    useState(false);
  const [formErrorsList, setFormErrorsList] = useState(
    Array.isArray(selectedSeats) ? new Array(selectedSeats.length).fill({}) : []
  );

  //Maneja los usuarios
  const handleChange = (e, index) => {
    const { name, value } = e.target;
    setFormDataList((prevFormDataList) => {
      const updatedFormDataList = [...prevFormDataList];
      updatedFormDataList[index] = {
        ...updatedFormDataList[index],
        [name]: value,
      };
      return updatedFormDataList;
    });
  };

  //Maneja la categoria
  const handleCategoriaChange = (e, index) => {
    const { value } = e.target;
    setFormDataList((prevFormDataList) => {
      const updatedFormDataList = [...prevFormDataList];
      updatedFormDataList[index] = {
        ...updatedFormDataList[index],
        categoria: value,
      };
      return updatedFormDataList;
    });
  };

  //Función que valida el llenado de datos
  const handleNext = () => {
    const errorsList = formDataList.map((formData, index) => {
      const errors = {};
      if (!formData.nombre.trim()) {
        errors.nombre = "Por favor ingresa tu nombre";
      }
      if (!formData.apellidoPaterno.trim()) {
        errors.apellidoPaterno = "Por favor ingresa tu apellido paterno";
      }
      if (!formData.apellidoMaterno.trim()) {
        errors.apellidoMaterno = "Por favor ingresa tu apellido materno";
      }
      if (!formData.categoria) {
        errors.categoria = "Por favor selecciona una categoría";
      }
      return errors;
    });
    setFormErrorsList(errorsList);

    //Nos dice si ya se registro al menos un
    if (!primerPasajeroRegistrado) {
      onFirstPassengerRegistered(formDataList);
      setPrimerPasajeroRegistrado(true);
    }

    if (errorsList.every((errors) => Object.keys(errors).length === 0)) {
      onNextTab(formDataList); // Pasar formDataList y primerPasajeroRegistrado
    }
  };

  //Si no hay asientos seleccionados retorna un mensaje
  if (!Array.isArray(selectedSeats)) {
    return <div>No hay asientos seleccionados</div>;
  }

  return (
    <div className="datos-pasajero-container">
      {selectedSeats.map((seat, index) => (
        <div className="forms-container" key={index}>
          <div className="top-row">
            <div className="name-container">
              <span className="pasajero-text">Pasajero {index + 1}</span>
              <span className="asiento-text">{seat}</span>
            </div>
          </div>
          <div className="form-container">
            <label>
              Nombre(s)
              <input
                type="text"
                name="nombre"
                value={formDataList[index].nombre}
                onChange={(e) => handleChange(e, index)}
              />
              {formErrorsList[index].nombre && (
                <span className="error">{formErrorsList[index].nombre}</span>
              )}
            </label>
            <label>
              Apellido Paterno
              <input
                type="text"
                name="apellidoPaterno"
                value={formDataList[index].apellidoPaterno}
                onChange={(e) => handleChange(e, index)}
              />
              {formErrorsList[index].apellidoPaterno && (
                <span className="error">
                  {formErrorsList[index].apellidoPaterno}
                </span>
              )}
            </label>
            <label>
              Apellido Materno
              <input
                type="text"
                name="apellidoMaterno"
                value={formDataList[index].apellidoMaterno}
                onChange={(e) => handleChange(e, index)}
              />
              {formErrorsList[index].apellidoMaterno && (
                <span className="error">
                  {formErrorsList[index].apellidoMaterno}
                </span>
              )}
            </label>
            <label>
              Correo Electronico
              <input
                type="text"
                name="correo"
                value={formDataList[index].correo}
                onChange={(e) => handleChange(e, index)}
                placeholder="(Opcional)"
              />
            </label>
            <div className="category-container">
              <h3>Categoria</h3>
              <div className="options-container">
                <label>
                  <input
                    type="radio"
                    name={`categoria${index}`}
                    value="Completo"
                    checked={formDataList[index].categoria === "Completo"}
                    onChange={(e) => handleCategoriaChange(e, index)}
                  />
                  Completo
                </label>
                <label>
                  <input
                    type="radio"
                    name={`categoria${index}`}
                    value="Inapam"
                    checked={formDataList[index].categoria === "Inapam"}
                    onChange={(e) => handleCategoriaChange(e, index)}
                  />
                  Inapam
                </label>
                <label>
                  <input
                    type="radio"
                    name={`categoria${index}`}
                    value="Profesor"
                    checked={formDataList[index].categoria === "Profesor"}
                    onChange={(e) => handleCategoriaChange(e, index)}
                  />
                  Profesor
                </label>
                <label>
                  <input
                    type="radio"
                    name={`categoria${index}`}
                    value="Medio"
                    checked={formDataList[index].categoria === "Medio"}
                    onChange={(e) => handleCategoriaChange(e, index)}
                  />
                  Medio
                </label>
              </div>
              {formErrorsList[index].categoria && (
                <span className="error">{formErrorsList[index].categoria}</span>
              )}
            </div>
          </div>
        </div>
      ))}
      <button className="btnHandleGoToPay" onClick={handleNext}>
        Siguiente
      </button>
    </div>
  );
};

export default DatosPasajero;
