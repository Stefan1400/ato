import Navbar from "./components/Navbar";
import MenuDropdown from "./components/MenuDropdown";
import { useState } from "react";
import { AppRouter } from "./app/router";
import Popup from "./components/Popup";

export default function App() {
  
  const [menuOpen, setMenuOpen] = useState(false);
  const [deleteAccountPopupOpen, setDeleteAccountPopupOpen] = useState(false);
  
  const toggleMenu = () => {
    setMenuOpen(prev => !prev);
  };

  const toggleDeleteAccountPopup = () => {
    setDeleteAccountPopupOpen(prev => !prev);
  };

  return (
    <div>
      <Navbar 
        toggleMenu={toggleMenu} 
        menuOpen={menuOpen} 
      />

      <MenuDropdown 
        toggleMenu={toggleMenu} 
        menuOpen={menuOpen}
        toggleDeleteAccountPopup={toggleDeleteAccountPopup}
      />

      {deleteAccountPopupOpen && (
        <Popup toggleDeleteAccountPopup={toggleDeleteAccountPopup} />
      )}

      <AppRouter />
    </div>
  );
};