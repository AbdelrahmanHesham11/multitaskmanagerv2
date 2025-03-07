import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from "react-router-dom";
import TaskList from "../components/TaskList";
import Input from "../components/input";
import { addGroupTask, getGroupTasks, markTaskAsCompleted, deleteCompletedTasks } from "../services/api";
import { supabaseClient } from "../services/api"; // Using the client from your API file for consistency
import "../App.css";
import { Task, Group } from "../types/types";

function DashboardGroup() {
  const { groupId } = useParams<{ groupId: string }>();
  const navigate = useNavigate();
  const [tasks, setTasks] = useState<Task[]>([]);
  const [group, setGroup] = useState<Group | null>(null);
  const [members, setMembers] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!groupId) {
      navigate('/groups');
      return;
    }
    
    fetchGroupDetails();
    refreshTasks();
    fetchGroupMembers();

    // Enable real-time updates for group tasks
    const subscription = supabaseClient
      .channel('tasks')
      .on('postgres_changes', { event: '*', schema: 'public', table: 'tasks', filter: `group_id=eq.${groupId}` }, refreshTasks)
      .subscribe();

    return () => {
      supabaseClient.removeChannel(subscription); // Cleanup on unmount
    };
  }, [groupId]);

  const fetchGroupDetails = async () => {
    if (!groupId) return;
    
    setIsLoading(true);
    try {
      const { data, error } = await supabaseClient
        .from("groups")
        .select("id, name, invite_code, created_by")
        .eq("id", groupId)
        .single();

      if (error) {
        console.error("Error fetching group details:", error.message);
        setError("Couldn't load group details. Please try again.");
        return;
      }
      
      setGroup(data);
    } catch (err) {
      console.error("Error in fetchGroupDetails:", err);
      setError("An unexpected error occurred");
    } finally {
      setIsLoading(false);
    }
  };

  const fetchGroupMembers = async () => {
    if (!groupId) return;
    
    try {
      const { data, error } = await supabaseClient
        .from("group_members")
        .select("user_id, profiles(username, display_name)")
        .eq("group_id", groupId);

      if (error) {
        console.error("Error fetching group members:", error.message);
        return;
      }
      
      setMembers(data || []);
    } catch (err) {
      console.error("Error in fetchGroupMembers:", err);
    }
  };

  const refreshTasks = async () => {
    if (!groupId) return;
    
    setIsLoading(true);
    try {
      const updatedTasks = await getGroupTasks(groupId);
      setTasks(updatedTasks);
    } catch (err) {
      console.error("Error refreshing tasks:", err);
      setError("Couldn't load tasks. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  const handleAddTask = async (title: string, description: string = "") => {
    if (!groupId || !title.trim()) return;
    
    try {
      await addGroupTask(title, description, groupId);
      refreshTasks();
    } catch (err) {
      console.error("Error adding task:", err);
      setError("Failed to add task. Please try again.");
    }
  };

  const handleTaskComplete = async (taskId: string) => {
    try {
      await markTaskAsCompleted(taskId);
      refreshTasks();
    } catch (err) {
      console.error("Error completing task:", err);
      setError("Failed to complete task. Please try again.");
    }
  };

  const handleClearCompleted = async () => {
    if (!groupId) return;
    
    try {
      await deleteCompletedTasks(groupId);
      refreshTasks();
    } catch (err) {
      console.error("Error clearing completed tasks:", err);
      setError("Failed to clear completed tasks. Please try again.");
    }
  };

  const copyInviteLink = () => {
    if (!group) return;
    
    const inviteLink = `${window.location.origin}/join-group/${groupId}`;
    navigator.clipboard.writeText(inviteLink)
      .then(() => alert("Invite link copied to clipboard!"))
      .catch(err => console.error("Failed to copy:", err));
  };

  if (isLoading && !group) {
    return (
      <div className="app-container">
        <div className="app-content">
          <h1 className="app-title">Loading Group...</h1>
          <div className="loading-spinner"></div>
        </div>
      </div>
    );
  }

  if (error && !group) {
    return (
      <div className="app-container">
        <div className="app-content">
          <h1 className="app-title">Error</h1>
          <p className="error-message">{error}</p>
          <button 
            className="action-button"
            onClick={() => navigate('/groups')}
          >
            Back to Groups
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="app-container">
      <div className="app-content">
        <div className="group-header">
          <button 
            className="back-button"
            onClick={() => navigate('/groups')}
          >
            ← Back
          </button>
          <h1 className="app-title">MultiTask Manager - Group Mode</h1>
        </div>
        
        {group && (
          <div className="group-info">
            <h2 className="group-name">{group.name}</h2>
            <div className="group-actions">
              <button 
                className="invite-button"
                onClick={copyInviteLink}
              >
                Copy Invite Link
              </button>
              <button 
                className="clear-button"
                onClick={handleClearCompleted}
              >
                Clear Completed
              </button>
            </div>
          </div>
        )}
        
        {error && <p className="error-message">{error}</p>}
        
        <Input onAddTask={handleAddTask} />
        
        {isLoading ? (
          <div className="loading-container">
            <div className="loading-spinner"></div>
          </div>
        ) : (
          <TaskList
            tasks={tasks}
            onTaskComplete={handleTaskComplete}
            refreshTasks={refreshTasks}
          />
        )}
        
        {members.length > 0 && (
          <div className="members-section">
            <h3>Group Members ({members.length})</h3>
            <ul className="members-list">
              {members.map((member, index) => (
                <li key={index} className="member-item">
                  {member.profiles?.display_name || member.profiles?.username || member.user_id}
                </li>
              ))}
            </ul>
          </div>
        )}
      </div>
    </div>
  );
}

export default DashboardGroup;
