import React, { useEffect, useState } from "react";
import { onSnapshot, collection, deleteDoc, doc } from "firebase/firestore";
import { DataGrid } from "@mui/x-data-grid";
import Button from "@mui/material/Button";
import { db } from "../../../firebase";
import { Link } from "react-router-dom";
import "./updateTravel.scss";

const columns = [
  { field: "id", headerName: "ID", width: 70 },
  { field: "originName", headerName: "Lugar origen", width: 130 },
  { field: "destinationName", headerName: "Lugar destino", width: 130 },
  {
    field: "originStationCode",
    headerName: "Codigo origen",
    width: 90,
  },
  {
    field: "destinationStationCode",
    headerName: "Codigo destino",
    width: 90,
  },
  {
    field: "fechaSalida",
    headerName: "Fecha salida",
    width: 120,
  },
  {
    field: "fechaLlegada",
    headerName: "Fecha llegada",
    width: 120,
  },
  {
    field: "carriage",
    headerName: "Carriage",
    width: 90,
  },
  {
    field: "zone",
    headerName: "Zona",
    width: 90,
  },
  {
    field: "precio",
    headerName: "Precio",
    width: 90,
  },
];

const UpdateTravel = () => {
  const [data, setData] = useState([]);

  useEffect(() => {
    const unsub = onSnapshot(
      collection(db, "viajes"),
      (snapshot) => {
        let list = [];
        snapshot.docs.forEach((doc) => {
          list.push({ id: doc.id, ...doc.data() });
        });
        setData(list);
      },
      (error) => {
        console.log(error);
      }
    );

    return () => {
      unsub();
    };
  }, []);
  const handleDelete = async (id) => {
    try {
      await deleteDoc(doc(db, "viajes", id));
      setData(data.filter((item) => item.id !== id));
    } catch (error) {
      console.log(error);
    }
  };
  const actionColumn = [
    {
      field: "action",
      headerName: "Action",
      width: 200,
      renderCell: (params) => {
        const id = params.row.id;
        return (
          <div className="cellAction">
            <Link to={`/admin/${id}`}>
              <Button variant="outlined" className="viewButton">
                View
              </Button>
            </Link>
            <Button variant="outlined" color="error" className="deleteButton">
              Delete
            </Button>
          </div>
        );
      },
    },
  ];

  return (
    <div className="dataTable">
      <div className="title">
        <h2>Viajes activos</h2>
      </div>
      <div style={{ height: 400, width: "100%" }}>
        <DataGrid
          rows={data}
          columns={columns.concat(actionColumn)}
          initialState={{
            pagination: {
              paginationModel: { page: 0, pageSize: 5 },
            },
          }}
          pageSizeOptions={[5, 10]}
          checkboxSelection
        />
      </div>
    </div>
  );
};

export default UpdateTravel;
