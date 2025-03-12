import React, { useState, useEffect } from 'react';
import TaskList from "../components/TaskList";
import Input from "../components/input";
import { addTask, getTasks, markTaskAsCompleted } from "../services/api";
import { supabase } from '../supabase/supabaseCLient';
import "../App.css";
import Navbar from '../components/Navbar';


<Navbar /> 
interface Task {
  id: string;
  title: string;
  description: string;
  status: string;
  user: string;
  completed?: boolean;
}
function Dashboard() {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [username, setUsername] = useState<string | null>(null);
  const [loading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    fetchUser();
    refreshTasks();
  }, []);

  const fetchUser = async () => {
    try {
      setLoading(true);
      const { data: { user }, error } = await supabase.auth.getUser();
      if (error) {
        console.error("Error fetching user:", error.message);
        return;
      }

      if (user) {
        const { data: profileData, error: profileError } = await supabase
          .from('profiles')
          .select('username')
          .eq('id', user.id)
          .single();

        const metadataUsername = user.user_metadata?.username || 
                                 user.user_metadata?.["Display name"];

        if (!profileError && profileData?.username) {
          setUsername(profileData.username);
        } else if (metadataUsername) {
          setUsername(metadataUsername);
          const { error: insertError } = await supabase
            .from('profiles')
            .upsert({ id: user.id, email: user.email, username: metadataUsername });

          if (insertError) {
            console.log("Could not create profile automatically:", insertError.message);
          }
        } else {
          setUsername(user.email?.split('')[0] || "User");
        }
      }
    } catch (err) {
      console.error("Error in fetchUser:", err);
    } finally {
      setLoading(false);
    }
  };

  const refreshTasks = async () => {
    const updatedTasks = await getTasks();
    setTasks(updatedTasks);
  };

  const handleAddTask = async (title: string) => {
    await addTask(title);
    refreshTasks();
  };

  const handleTaskComplete = async (id: string) => {
    await markTaskAsCompleted(id);
    refreshTasks();
  };


  return (
    <div className="app-container">
      {/* ✅ Navbar is now inside the component */}
      <Navbar /> 

      <div className="app-content">
        <div className="flex justify-between items-center mb-4">
          <h1 className="app-title">MultiTask Manager</h1>

        </div>
        
        <div className="app-subtitle">
          {loading ? 'Loading...' : `Hello, ${username ? `${username}` : 'Stranger'}!`}
        </div>
        
        <Input onAddTask={handleAddTask} />
        <TaskList 
          tasks={tasks} 
          onTaskComplete={handleTaskComplete} 
          refreshTasks={refreshTasks} 
        />
      </div>
    </div>
  );
}

export default Dashboard;
