import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import Button from "@mui/material/Button";
import { doc, getDoc } from "firebase/firestore";
import { db } from "../../firebase";
import "./ResumenCompra.scss";
import logo from "../../assets/Conecta-01.png";
import img from "../../assets/wallet-button.png";
import imgApple from "../../assets/appleWButton.png";

const ResumenCompra = () => {
  //variables
  const navigate = useNavigate();
  const [data, setData] = useState(null);
  const [dataPagos, setDataPagos] = useState(null);
  const [dataBoleto, setdataBoleto] = useState(null);
  const { id_boleto, id_pago } = useParams();

  useEffect(() => {
    const fetchData = async () => {
      if (id_boleto !== null) {
        try {
          // Obtener referencia al documento
          const viajeDocRef = doc(db, "viajes", id_boleto);

          // Obtener los datos del documento
          const docSnap = await getDoc(viajeDocRef);

          if (docSnap.exists()) {
            // El documento existe, por lo tanto, obtén los datos y configúralos en el estado
            setData({ id: docSnap.id, ...docSnap.data() });
          } else {
            // El documento no existe
            console.log("No existe ningún documento con el ID proporcionado.");
          }

          // Obtener referencia al documento
          const pagoDocRef = doc(db, "pagos", `${id_pago}0X`);

          // Obtiene el documento utilizando su referencia
          const pagoDocSnapshot = await getDoc(pagoDocRef);

          //Guarda en data los datos del documento
          setDataPagos(pagoDocSnapshot.data());

          // Obtener referencia al documento
          const boletoDocRef = doc(db, "boletos", id_pago);

          // Obtiene el documento utilizando su referencia
          const boletoDocSnapshot = await getDoc(boletoDocRef);

          setdataBoleto(boletoDocSnapshot.data());
        } catch (error) {
          console.error("Error al obtener el documento:", error);
        }
      }
    };

    fetchData(); // Llama a la función para obtener los datos cuando el componente se monta
  }, [id_boleto]);

  if (data !== null && dataPagos !== null && dataBoleto !== null) {
    return (
      <div className="resumen">
        <img
          src={logo}
          style={{ width: "200px", height: "40px", display: "inline" }}
        />
        <div className="mainContainer">
          <div className="title">Gracias por tu compra</div>
          <span>Aqui tu resumen:</span>
          <div className="datos">
            <div className="orgDes">
              <span>Origen: {data.originName}</span>
              <span>Destino: {data.destinationName}</span>
            </div>
            <div className="fechas">
              <span>Salida: {data.fechaSalida}</span>
              <span>Llegada: {data.fechaLlegada}</span>
            </div>
            <div className="horas">
              <span>Hora salida: {data.horaSalida}</span>
              <span>Hora regreso: {data.horaLlegada}</span>
            </div>
            <div className="nombreComprador">
              <span>Nombres: {dataBoleto.passengerNames}</span>
              <span>Asientos: {dataBoleto.seat}</span>
            </div>
            <div className="datosPago">
              <span>Metodo pago: {dataPagos.metodo_pago}</span>
              <span>Token de facturación: {dataPagos.token_facturacion}</span>
              <span>Total pago: $ {dataPagos.total_pago}.00</span>
            </div>
          </div>
          <div className="botones">
            <img
              src={img}
              alt="btnWallet"
              onClick={() => window.open(dataBoleto.url)}
              style={{
                width: 200,
                height: 50,
                marginTop: "10px",
                display: "inline",
                cursor: "pointer",
              }}
            />
            <img
              src={imgApple}
              alt="btnWallet"
              onClick={() =>
                window.open(
                  `https://abrirboletoapple-klapxs6vqa-uc.a.run.app?id=${id_pago}`
                )
              }
              style={{
                width: 200,
                height: 50,
                marginTop: "10px",
                display: "inline",
                cursor: "pointer",
              }}
            />
          </div>
          <Button
            variant="contained"
            color="success"
            onClick={() => navigate("/")}
          >
            Terminar
          </Button>
        </div>
      </div>
    );
  }
};

export default ResumenCompra;
