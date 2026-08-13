import Navbar from "./components/Navbar";
import MenuDropdown from "./components/MenuDropdown";
import { useState, useContext } from "react";
import { AppRouter } from "./app/router";
import Popup from "./components/Popup";
import { useLocation } from "react-router-dom";
import { AuthContext } from "./app/AuthProvider";

export default function App() {
  
  const [menuOpen, setMenuOpen] = useState(false);
  const [deleteAccountPopupOpen, setDeleteAccountPopupOpen] = useState(false);
  const location = useLocation();
  const auth = useContext(AuthContext);
  const isAuthenticated = Boolean(auth?.user);
  const hideMenu = !isAuthenticated && ['/', '/signup', '/login'].includes(location.pathname);
  
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
        toggleDeleteAccountPopup={toggleDeleteAccountPopup}
      />

      {!hideMenu && (
        <MenuDropdown 
          toggleMenu={toggleMenu} 
          menuOpen={menuOpen}
          toggleDeleteAccountPopup={toggleDeleteAccountPopup}
        />
      )}

      {deleteAccountPopupOpen && (
        <Popup 
          toggleDeleteAccountPopup={toggleDeleteAccountPopup} 
          toggleMenu={toggleMenu}
        />
      )}

      <AppRouter />
    </div>
  );
};