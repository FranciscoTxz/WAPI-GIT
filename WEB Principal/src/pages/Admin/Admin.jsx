import React, { useState } from "react";
import "./admin.scss";
import CreateTravelForm from "../../components/Admin/CreateTravelForm/CreateTravelForm";
import UpdateTravel from "../../components/Admin/UpdateTravel/UpdateTravel";
import { UpdateTicketForm } from "../../components/Admin/UpdateTicketForm/UpdateTicketForm";

const Tabs = ({ config }) => {
  const [activeTab, setActiveTab] = useState(0);
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
                  onClick={() => setActiveTab(index)}
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

const Admin = () => {
  return (
    <Tabs
      config={[
        { header: "Crear viajes", component: <CreateTravelForm /> },
        { header: "Modificar viajes", component: <UpdateTravel /> },
        { header: "Modificar boleto", component: <UpdateTicketForm /> },
      ]}
    />
  );
};

export default Admin;
