import RegisterPage from "./features/auth/RegisterPage";
import LoginPage from "./features/auth/LoginPage";
import Navbar from "./components/Navbar";

export default function App() {
  return (
    <div className="">
      <Navbar />
      
      {/* <RegisterPage /> */}
      <LoginPage />
    </div>
  );
};