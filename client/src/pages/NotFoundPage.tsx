import { Link } from "react-router-dom";
import { useContext } from "react";
import { AuthContext, type AuthContextType } from "../app/AuthProvider";

function NotFoundPage() {
  const { user } = useContext(AuthContext) as AuthContextType;

  return (
    <main className="relative w-screen min-h-screen bg-[#090909]/95 backdrop-blur-sm px-6 grid place-items-center text-white">
      <div className="page-background-gradient"></div>
      
      <div className="flex flex-col items-center justify-center text-center max-w-lg">
        <h1 className="text-8xl sm:text-9xl font-bold">404</h1>

        <p className="mt-6 text-lg text-gray-400">
          We couldn't find the page you were looking for.
        </p>

        <Link
          to={user ? "/dashboard" : "/"}
          className="mt-10 px-6 py-3 rounded-md bg-[#161616] border border-[#2A2A2A] hover:bg-[#1E1E1E] transition-colors duration-200 font-medium"
        >
          {user ? "Go to Dashboard" : "Go to Welcome Page"}
        </Link>
      </div>
    </main>
  );
}

export default NotFoundPage;