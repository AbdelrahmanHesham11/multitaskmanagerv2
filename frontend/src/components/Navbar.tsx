import React from "react";
import { Link, useNavigate } from "react-router-dom";
import { supabase } from "../supabase/supabaseCLient";

const Navbar = () => {
  const [username, setUsername] = React.useState<string | null>(null);
  const navigate = useNavigate();
//hello! again!
  React.useEffect(() => {
    const fetchUser = async () => {
      const { data: { user } } = await supabase.auth.getUser();
      if (user) {
        const { data: profileData } = await supabase
          .from("profiles")
          .select("username")
          .eq("id", user.id)
          .single();
        
        setUsername(profileData?.username || "User");
      }
    };
    fetchUser();
  }, []);

  const handleSignOut = async () => {
    await supabase.auth.signOut();
    setUsername(null);
    navigate("/auth"); // Redirect to login/signup page
  };

  return (
    <nav className="bg-gray-900 text-white p-4 fixed top-0 left-0 w-full shadow-md z-10 flex justify-between items-center">
      <h1 className="text-xl font-bold">
        <Link to="/">MultiTask Manager</Link>
      </h1>
      <div className="flex space-x-4 items-center">
        <Link to="/modeselection" className="hover:underline">Mode Selection</Link>
        {username ? (
          <div className="flex items-center space-x-4">
            <span className="text-sm">Hi, {username}!</span>
            <button 
              onClick={handleSignOut} 
              className="bg-red-500 px-4 py-2 rounded-md text-sm hover:bg-red-600 transition"
            >
              Sign Out
            </button>
          </div>
        ) : (
          <Link to="/auth" className="bg-blue-500 px-4 py-2 rounded-md text-sm hover:bg-blue-600 transition">
            Join us!
          </Link>
        )}
      </div>
    </nav>
  );
};

export default Navbar;
