import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { createGroup, joinGroup } from "../services/api";
import Navbar from "../components/Navbar";

// Inline styles object
const styles = {
  page: {
    fontFamily: '"Poppins", sans-serif',
    background: 'linear-gradient(135deg, #1e1e2e, #232946)',
    color: '#fff',
    margin: 0,
    padding: 0,
    minHeight: '100vh', // Changed from height to minHeight
    display: 'flex',
    flexDirection: 'column' as const, // Added to stack navbar above content
  },
  contentContainer: {
    flex: 1,
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    padding: '20px',
  },
  container: {
    background: 'rgba(255, 255, 255, 0.1)',
    backdropFilter: 'blur(12px)',
    padding: '40px',
    borderRadius: '16px',
    boxShadow: '0px 10px 30px rgba(0, 0, 0, 0.2)',
    textAlign: 'center' as const,
    maxWidth: '400px',
    width: '90%',
  },
  title: {
    fontSize: '2rem',
    fontWeight: 700,
    marginBottom: '20px',
    color: '#e0e0e0',
  },
  inputGroup: {
    marginBottom: '20px',
    width: '100%',
  },
  label: {
    display: 'block',
    textAlign: 'left' as const,
    marginBottom: '8px',
    fontSize: '1rem',
    fontWeight: 600,
    color: '#e0e0e0',
  },
  input: {
    width: '100%',
    padding: '12px',
    background: 'rgba(255, 255, 255, 0.1)',
    border: '1px solid rgba(255, 255, 255, 0.2)',
    borderRadius: '8px',
    color: '#fff',
    fontSize: '1rem',
    outline: 'none',
    transition: 'all 0.3s ease',
  },
  buttonGroup: {
    display: 'flex',
    flexDirection: 'column' as const,
    gap: '15px',
    marginTop: '20px',
  },
  button: {
    padding: '14px 20px',
    border: 'none',
    borderRadius: '8px',
    fontSize: '1.1rem',
    fontWeight: 600,
    cursor: 'pointer',
    transition: 'all 0.3s ease-in-out',
    width: '100%',
  },
  createButton: {
    background: 'linear-gradient(90deg, #4facfe, #00f2fe)',
    color: 'white',
    boxShadow: '0px 4px 10px rgba(0, 242, 254, 0.3)',
  },
  joinButton: {
    background: 'linear-gradient(90deg, #43e97b, #38f9d7)',
    color: 'white',
    boxShadow: '0px 4px 10px rgba(67, 233, 123, 0.3)',
  },
  disabledButton: {
    background: '#555',
    cursor: 'not-allowed',
    boxShadow: 'none',
  },
  errorMessage: {
    fontSize: '0.9rem',
    color: '#e63946',
    marginTop: '10px',
  },
  inviteBox: {
    background: 'rgba(255, 255, 255, 0.1)',
    padding: '15px',
    borderRadius: '8px',
    marginTop: '20px',
    textAlign: 'center' as const,
  },
  inviteTitle: {
    fontSize: '0.9rem',
    color: '#e0e0e0',
    marginBottom: '5px',
  },
  inviteLink: {
    fontSize: '0.95rem',
    fontWeight: 'bold',
    color: '#4facfe',
    wordBreak: 'break-all' as const,
  },
  inviteCode: {
    fontSize: '1.2rem',
    fontWeight: 'bold',
    color: '#e0e0e0',
    marginTop: '5px',
  },
};

const GroupSelection: React.FC = () => {
  const navigate = useNavigate();
  const [groupName, setGroupName] = useState("");
  const [groupId, setGroupId] = useState("");
  const [inviteCode, setInviteCode] = useState("");
  const [inviteLink, setInviteLink] = useState("");
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const generateInviteCode = () => {
    return Math.random().toString(36).substring(2, 8).toUpperCase();
  };

  const handleCreateGroup = async () => {
    if (!groupName.trim()) {
      setError("Please enter a group name");
      return;
    }
    setIsLoading(true);
    setError("");
    try {
      const code = generateInviteCode();
      const group = await createGroup(groupName, code);
      if (group) {
        setInviteCode(code);
        setInviteLink(`${window.location.origin}/join-group/${group.id}`);
      } else {
        setError("Failed to create group. Please try again.");
      }
    } catch (err) {
      setError("An error occurred. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  const handleJoinGroup = async () => {
    if (!groupId.trim()) {
      setError("Please enter a group ID or invite code");
      return;
    }
    setIsLoading(true);
    setError("");
    try {
      const success = await joinGroup(groupId);
      if (success) {
        navigate(`/dashboard/group/${groupId}`);
      } else {
        setError("Invalid group ID or invite code.");
      }
    } catch (err) {
      setError("An error occurred. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div style={styles.page}>
      {/* Add the Navbar component here */}
      <Navbar />
      
      {/* Create a content container for the centered card */}
      <div style={styles.contentContainer}>
        <div style={styles.container}>
          <h1 style={styles.title}>Join or Create a Group</h1>
          
          <div style={styles.inputGroup}>
            <label style={styles.label}>Create a new group</label>
            <input
              type="text"
              placeholder="Enter group name"
              value={groupName}
              onChange={(e) => setGroupName(e.target.value)}
              style={styles.input}
            />
            
            <button
              style={{
                ...styles.button,
                ...styles.createButton,
                ...(isLoading ? styles.disabledButton : {})
              }}
              onClick={handleCreateGroup}
              disabled={isLoading}
            >
              {isLoading ? 'Creating...' : 'Create Group'}
            </button>
            
            {inviteLink && (
              <div style={styles.inviteBox}>
                <p style={styles.inviteTitle}>Invite Link:</p>
                <p style={styles.inviteLink}>{inviteLink}</p>
                <p style={styles.inviteTitle}>Invite Code:</p>
                <p style={styles.inviteCode}>{inviteCode}</p>
              </div>
            )}
          </div>
          
          <div style={styles.inputGroup}>
            <label style={styles.label}>Join an existing group</label>
            <input
              type="text"
              placeholder="Enter group ID or Invite Code"
              value={groupId}
              onChange={(e) => setGroupId(e.target.value)}
              style={styles.input}
            />
            <button
              style={{
                ...styles.button,
                ...styles.joinButton,
                ...(isLoading ? styles.disabledButton : {})
              }}
              onClick={handleJoinGroup}
              disabled={isLoading}
            >
              {isLoading ? 'Joining...' : 'Join Group'}
            </button>
          </div>
          
          {error && <p style={styles.errorMessage}>{error}</p>}
        </div>
      </div>
    </div>
  );
};

export default GroupSelection;