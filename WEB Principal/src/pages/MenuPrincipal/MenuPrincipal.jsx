import React from "react";
import Navbar from "../../components/Home/Navbar/Navbar";
import Home from "../../components/Home/Home";
import Footer from "../../components/Home/Footer/Footer";


const MenuPrincipal = () => {
  return (
    <div>
      <Navbar />
      <Home />
      {/*<Main />*/}
      <Footer />
    </div>
  );
};

export default MenuPrincipal;
