import React, { useContext, useState, useEffect } from "react";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import "./app.css";
import Welcome from "./pages/Welcome/Welcome.jsx";
import Login from "./pages/Auth/login/Login.jsx";
import MenuPrincipal from "./pages/MenuPrincipal/MenuPrincipal.jsx";
import SignUp from "./pages/Auth/signup/SignUp.jsx";
import Departures from "./pages/Departures/Departures.jsx";
import History from "./pages/History/History.jsx";

import { AuthContext } from "./context/AuthContext";
import Travels from "./pages/Travels/Travels.jsx";
import Admin from "./pages/Admin/Admin.jsx";
import { Travel } from "./pages/Admin/Travel/Travel.jsx";
import Ticket from "./pages/Admin/Ticket/Ticket.jsx";
import ResumenCompra from "./pages/ResumenCompra/ResumenCompra.jsx";

function App() {
  const [email, setEmail] = useState("");
  const { currentUser } = useContext(AuthContext);

  useEffect(() => {
    if (currentUser !== null) {
      setEmail(currentUser.email);
    }
  }, [currentUser]);

  const RequireAuth = ({ children }) => {
    return currentUser ? children : <Navigate to="/welcome" />;
  };

  const RequireAdmin = ({ children }) => {
    return currentUser.email === "rsp_63@hotmail.com" ||
      currentUser.email === "angelftv2002@hotmail.com" ? (
      children
    ) : (
      <Navigate to="/" />
    );
  };

  return (
    <div>
      <BrowserRouter>
        <Routes>
          <Route path="/">
            <Route path="welcome" element={<Welcome />} />
            <Route path="login" element={<Login />} />
            <Route path="signup" element={<SignUp />} />
            <Route
              index
              element={
                <RequireAuth>
                  <MenuPrincipal />
                </RequireAuth>
              }
            />
            <Route
              path="/history"
              element={
                <RequireAuth>
                  <History />
                </RequireAuth>
              }
            />
            <Route
              path="/departures/:id"
              element={
                <RequireAuth>
                  <Departures />
                </RequireAuth>
              }
            />
            <Route
              path="/travels"
              element={
                <RequireAuth>
                  <Travels />
                </RequireAuth>
              }
            />
            <Route
              path="/resumenCompra/:id_boleto/:id_pago"
              element={<ResumenCompra />}
            />
            <Route path="admin">
              <Route
                index
                element={
                  <RequireAdmin>
                    <Admin />
                  </RequireAdmin>
                }
              />
              <Route
                path=":id"
                element={
                  <RequireAdmin>
                    <Travel />
                  </RequireAdmin>
                }
              />
              <Route
                path="ticket/:idBoleto"
                element={
                  <RequireAdmin>
                    <Ticket />
                  </RequireAdmin>
                }
              />
            </Route>
          </Route>
        </Routes>
      </BrowserRouter>
    </div>
  );
}

export default App;
