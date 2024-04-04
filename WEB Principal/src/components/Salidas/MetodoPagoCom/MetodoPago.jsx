import React, { useState, useEffect, useContext } from "react";
import { AuthContext } from "../../../context/AuthContext";
import random from "random";
import "./metodoPago.scss";
import { setDoc, doc } from "firebase/firestore";
import { db } from "../../../firebase";
import { useNavigate } from "react-router-dom";
import LoadingButton from "@mui/lab/LoadingButton";

//Funcion principal que recibe datos de pasajeros, precio, asientos y id
const MetodoPago = ({ firstPassengerData, precio, asientos, id }) => {
  //Variables
  const navigate = useNavigate();
  const [formDataPago, setFormDataPago] = useState({});
  const { currentUser } = useContext(AuthContext);
  const [tamaño] = useState(asientos.length);
  const [precioT] = useState(tamaño * precio);
  const [formErrors] = useState({});
  const [metodoPago, setmetodoPago] = useState("Efectivo");
  const [reciboCompra] = useState(random.int(10000, 100000));
  const [id_boleto] = useState(random.int(10000, 100000));
  const [nombresCompletos, setnombresCompletos] = useState("");
  const [asientosString, setasientosString] = useState("");
  const [cargando, setCargando] = useState(false);

  //UseEffect que maneja y setea las variables que llegan
  useEffect(() => {
    if (firstPassengerData.length > 0) {
      //Mapea los pasajeros
      const nombresCompletos = firstPassengerData.map(
        (pasajero) =>
          `${pasajero.nombre} ${pasajero.apellidoPaterno} ${pasajero.apellidoMaterno}`
      );

      setnombresCompletos(nombresCompletos.join(", "));
    }
    setasientosString(asientos.join(", "));

    //Maneja los datos en un formData para tenerlo todo
    setFormDataPago({
      nombre: firstPassengerData[0].nombre,
      apellidoPaterno: firstPassengerData[0].apellidoPaterno,
      apellidoMaterno: firstPassengerData[0].apellidoMaterno,
      categoria: firstPassengerData[0].categoria,
    });
  }, [firstPassengerData]);

  //Función que manda
  const handleCreateTicket = async (e) => {
    e.preventDefault();
    setCargando(true);
    try {
      const pagoData = {
        metodo_pago: metodoPago,
        token_facturacion: reciboCompra,
        total_pago: precioT,
      };

      // Utiliza addDoc para insertar datos en la colección "pagos" con un nuevo ID de boleto
      //NO MOVER
      await setDoc(doc(db, "pagos", `${id_boleto}0X`), pagoData);

      const response = await fetch(
        `https://crearobjeto-klapxs6vqa-uc.a.run.app?id=${id_boleto}&e=Vigente&c=${formDataPago.categoria}&u=${currentUser.uid}&pn=${nombresCompletos}&s=${asientosString}&iv=${id}&prn=${id_boleto}0X&cñ=Prueba1234`
      );

      const responseAppleWallet = await fetch(
        `https://crearboletoapple-klapxs6vqa-uc.a.run.app?id=${id_boleto}&cñ=Prueba1234`
      );

      const dataA = await responseAppleWallet.json();
      console.log(dataA);

      const responseEmail = await fetch(
        `https://mandarmail-klapxs6vqa-uc.a.run.app?id=${id_boleto}&cñ=Prueba1234&tipo=1`
      );

      const responseMensaje = await fetch(
        `https://mandarwhats-klapxs6vqa-uc.a.run.app?id=${id_boleto}&tipo=1&cñ=Prueba1234`
      );
      setCargando(false);
      alert("Boleto Creado");
      navigate(`/resumenCompra/${id}/${id_boleto}`);
    } catch (error) {
      console.log(error);
    }
  };

  const handleChangePay = (e) => {
    const { name, value } = e.target;
    setFormDataPago({
      ...formDataPago,
      [name]: value,
    });
  };

  const handleNextPay = () => {
    // Validar el formulario
    const errors = {};
    if (!formDataPago.nombre.trim()) {
      errors.nombre = "Por favor ingresa tu nombre";
    }
    if (!formDataPago.apellidoPaterno.trim()) {
      errors.apellidoPaterno = "Por favor ingresa tu apellido paterno";
    }
    if (!formDataPago.codigoPais.trim()) {
      errors.codigoPais = "Por favor ingresa tu Codigo de Pais";
    }
    if (!formDataPago.telefono.trim()) {
      errors.telefono = "Por favor ingresa tu Telefono";
    }
    if (!formDataPago.correo.trim()) {
      errors.correo = "Por favor ingresa tu correo";
    }
    if (!formDataPago.nombreTar.trim()) {
      errors.nombreTar = "Por favor ingresa el nombre del Titular";
    }
    if (!formDataPago.numeroTar.trim()) {
      errors.numeroTar = "Por favor ingresa tu apellido paterno";
    }
    if (!formDataPago.fechaExp.trim()) {
      errors.fechaExp = "Por favor ingresa tu apellido paterno";
    }
    if (!formDataPago.codigoSeg.trim()) {
      errors.codigoSeg = "Por favor ingresa tu apellido paterno";
    }

    // Si no hay errores, continuar a la siguiente página
    if (Object.keys(errors).length === 0) {
      // Aquí deberías navegar a la siguiente página
      console.log("Formulario válido, pasando a la siguiente página");
    } else {
      console.log("Por favor completa todos los campos");
    }
  };

  return (
    <div className="main-metodopago">
      <div className="content-main">
        <div className="content-datosCom">
          <h2>Datos del Comprador</h2>
          <div className="campo Nom">
            <label>Nombre(s) </label>
            <input
              type="text"
              name="nombre"
              value=""
              onChange={handleChangePay}
            />
            {formErrors.nombre && (
              <span className="error">{formErrors.nombre}</span>
            )}
          </div>
          <div className="campo Ape">
            <label>Apellido Paterno </label>
            <input
              type="text"
              name="apellidoPaterno"
              value=""
              onChange={handleChangePay}
            />
            {formErrors.apellidoPaterno && (
              <span className="error">{formErrors.apellidoPaterno}</span>
            )}
          </div>
          <div className="campo CodPais">
            <label>Codigo de país</label>
            <input
              type="text"
              name="codigoPais"
              value={formDataPago.codigoPais}
              onChange={handleChangePay}
            />
            {formErrors.codigoPais && (
              <span className="error">{formErrors.codigoPais}</span>
            )}
          </div>
          <div className="campo Tel">
            <label>Telefono</label>{" "}
            <input
              type="number"
              name="telefono"
              value={formDataPago.telefono}
              onChange={handleChangePay}
            />
            {formErrors.telefono && (
              <span className="error">{formErrors.telefono}</span>
            )}
          </div>
          <div className="campo Correo">
            <label>Correo Electronico </label>
            <input
              type="text"
              placeholder="(Opcional)"
              name="correo"
              value={formDataPago.correo}
              onChange={handleChangePay}
            />
            {formErrors.correo && (
              <span className="error">{formErrors.correo}</span>
            )}
          </div>
        </div>

        <div className="content-pagos">
          <h2>Forma de Pago</h2>
          <select onChange={(e) => setmetodoPago(e.target.value)}>
            <option value="Efectivo">Efectivo</option>
            <option value="Tarjeta">Tarjeta</option>
          </select>
        </div>
        <div className="content-datostit">
          <h2>Datos del Titular</h2>
          <div className="campo NombreTar">
            <label>Nombre del Titular de la Tarjeta</label>
            <input
              type="text"
              name="nombreTar"
              value={formDataPago.nombreTar}
              onChange={handleChangePay}
            />
            {formErrors.nombreTar && (
              <span className="error">{formErrors.nombreTar}</span>
            )}
          </div>
          <div className="campo NumTar">
            <label>Numero de la Tarjeta</label>
            <input
              type="number"
              placeholder="1234 5678 9987 6443"
              name="numeroTar"
              value={formDataPago.numeroTar}
              onChange={handleChangePay}
            />
            {formErrors.numeroTar && (
              <span className="error">{formErrors.numeroTar}</span>
            )}
          </div>
          <div className="campo FechEx">
            <label>Fecha de Expiracion </label>
            <input
              type="text"
              placeholder="MM / AA"
              name="fechaExp"
              value={formDataPago.fechaExp}
              onChange={handleChangePay}
            />
            {formErrors.fechaExp && (
              <span className="error">{formErrors.fechaExp}</span>
            )}
          </div>
          <div className="campo CodSeg">
            <label>Codigo de Seguridad</label>
            <input
              type="text"
              placeholder="CVV / CVC"
              name="codigoSeg"
              value={formDataPago.codigoSeg}
              onChange={handleChangePay}
            />
            {formErrors.codigoSeg && (
              <span className="error">{formErrors.codigoSeg}</span>
            )}
          </div>
        </div>
      </div>
      <div className="content-summary">
        <div className="card-sumary">
          <div className="content-header">
            <h2>Pago Total</h2>
            <label>${precioT}.00</label>
          </div>
          <div className="content-data">
            <lu>
              <li>
                <p>
                  Nombre del pasajero
                  <label>{firstPassengerData[0].nombre}</label>
                </p>
              </li>
              <li>
                <p>
                  Categoria<label>{firstPassengerData[0].categoria}</label>
                </p>
              </li>
              <li>
                <p>
                  Precio<label>${precio}.00</label>
                </p>
              </li>

              <li className="content-total">
                <h2>
                  Total <label>${precioT}.00</label>
                </h2>
              </li>
            </lu>
          </div>
        </div>
      </div>
      <LoadingButton
        loading={cargando}
        variant="outlined"
        onClick={handleCreateTicket}
      >
        Finalizar compra por: $ {precioT}.00
      </LoadingButton>
    </div>
  );
};

export default MetodoPago;
