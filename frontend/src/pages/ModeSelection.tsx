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
      setIsAuthenticated(!!user);
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
    <div className="mode-selection-page">
      <Navbar />
      <div className="mode-selection">
        <h1>Select Mode</h1>
        <div className="mode-buttons">
          <button className={`solo ${!isAuthenticated ? "disabled" : ""}`} onClick={() => handleModeClick("/dashboard")}>
            Solo Mode
          </button>
          <button className={`group ${!isAuthenticated ? "disabled" : ""}`} onClick={() => handleModeClick("/GroupSelection")}>
            Group Mode
          </button>
        </div>
        {!isAuthenticated && <p>Please sign in to continue.</p>}
      </div>
    </div>
  );
};

export default ModeSelection;
