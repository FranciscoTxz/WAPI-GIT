import React, { useState, useEffect } from "react";
import NavSalidasADM from "../../components/Salidas/NavSalidasCom/NavSalidasADM";
import Footer from "../../components/Home/Footer/Footer";
import TabsSalidasADM from "../../components/Salidas/TabsSalidasADM";
import { db } from "../../firebase";

import { useParams } from "react-router-dom";

import { doc, getDoc } from "firebase/firestore";

const Departures = () => {
  const { id } = useParams();
  const [data, setdata] = useState({});
  // Obtén los valores de los parámetros de consulta
  useEffect(() => {
    const fetchData = async () => {
      if (id !== null) {
        try {
          // Obtener referencia al documento
          const viajeDocRef = doc(db, "viajes", id);

          // Obtener los datos del documento
          const docSnap = await getDoc(viajeDocRef);

          if (docSnap.exists()) {
            setdata({
              id: docSnap.id,
              ...docSnap.data(),
            });
          } else {
            // El documento no existe
            console.log("No existe ningún documento con el ID proporcionado.");
          }
        } catch (error) {
          console.error("Error al obtener el documento:", error);
        }
      }
    };

    fetchData(); // Llama a la función para obtener los datos cuando el componente se monta
  }, [id]);

  return (
    <div>
      <NavSalidasADM
        origen={data.originName}
        destino={data.destinationName}
        hora={data.horaSalida}
      />
      <TabsSalidasADM precio={data.precio} id={data.id} />
      <Footer />
    </div>
  );
};

export default Departures;
