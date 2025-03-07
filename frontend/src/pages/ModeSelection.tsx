import React from "react";
import { useNavigate } from "react-router-dom";

const ModeSelection: React.FC = () => {
  const navigate = useNavigate();

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-100">
      <h1 className="text-3xl font-bold mb-6">Choose Your Mode</h1>
      <div className="flex space-x-4">
        <button
          className="bg-blue-500 text-white px-6 py-3 rounded-lg hover:bg-blue-600"
          onClick={() => navigate("/dashboard")}
        >
          Solo Mode
        </button>
        <button
          className="bg-green-500 text-white px-6 py-3 rounded-lg hover:bg-green-600"
          onClick={() => navigate("/group-setup")}
        >
          Group Mode
        </button>
      </div>
    </div>
  );
};

export default ModeSelection;
