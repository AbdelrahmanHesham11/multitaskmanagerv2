import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import Navbar from "../components/Navbar";
import { supabase } from "../supabase/supabaseCLient";

const ModeSelection: React.FC = () => {
  const navigate = useNavigate();
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  useEffect(() => {
    const checkAuth = async () => {
      const { data: { user } } = await supabase.auth.getUser();
      setIsAuthenticated(!!user); // Set to true if user exists, false otherwise
    };
    checkAuth();
  }, []);

  const handleModeClick = (path: string) => {
    if (!isAuthenticated) {
      alert("You need to be signed in to access this mode!");
      return;
    }
    navigate(path);
  };

  return (
    <div>
      <Navbar />
      <div className="flex flex-col items-center justify-center min-h-screen bg-gray-100">
        <h1 className="text-3xl font-bold mb-6">Choose Your Mode</h1>
        <div className="flex space-x-4">
          <button
            className={`px-6 py-3 rounded-lg text-white transition ${
              isAuthenticated ? "bg-blue-500 hover:bg-blue-600" : "bg-gray-400 cursor-not-allowed"
            }`}
            onClick={() => handleModeClick("/dashboard")}
          >
            Solo Mode
          </button>
          <button
            className={`px-6 py-3 rounded-lg text-white transition ${
              isAuthenticated ? "bg-green-500 hover:bg-green-600" : "bg-gray-400 cursor-not-allowed"
            }`}
            onClick={() => handleModeClick("/GroupSelection")}
          >
            Group Mode
          </button>
        </div>
        {!isAuthenticated && <p className="text-red-500 mt-4">Please sign in to continue.</p>}
      </div>
    </div>
  );
};

export default ModeSelection;
