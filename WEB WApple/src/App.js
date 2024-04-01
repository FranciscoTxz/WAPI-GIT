import React from 'react';
import { BrowserRouter, Routes, Route } from "react-router-dom";
import MainPage from './components/MainPage';
import TicketPage from './components/TicketPage';
import TicketBreakdownPage from './components/TicketBreakdownPage.jsx';
import './App.css';

function App() {
  return (
    <div className="App">
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<MainPage />} />
          <Route path="ticket" Component={TicketPage} />
          <Route path="ticket-breakdown" Component={TicketBreakdownPage} />
        </Routes>
      </BrowserRouter>
    </div>
  );
}
export default App;
