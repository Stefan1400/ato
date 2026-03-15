import RegisterPage from "./features/auth/RegisterPage";
import LoginPage from "./features/auth/LoginPage";
import Navbar from "./components/Navbar";
import MenuDropdown from "./components/MenuDropdown";
import { useState } from "react";
import { AppRouter } from "./app/router";
import Popup from "./components/Popup";

export default function App() {
  
  const [menuOpen, setMenuOpen] = useState(false);
  
  const toggleMenu = () => {
    setMenuOpen(prev => !prev);
  };

  return (
    <div>
      <Navbar 
        toggleMenu={toggleMenu} 
        menuOpen={menuOpen} 
      />
      
      {/* {menuOpen && (
        <MenuDropdown toggleMenu={toggleMenu}/>
      )} */}

      <MenuDropdown toggleMenu={toggleMenu} menuOpen={menuOpen}/>

      <Popup />

      {/* <RegisterPage /> */}
      {/* <LoginPage /> */}

      <AppRouter />
    </div>
  );
};