import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { createGroup, joinGroup } from "../services/api";

const GroupSelection: React.FC = () => {
  const navigate = useNavigate();
  const [groupName, setGroupName] = useState("");
  const [groupId, setGroupId] = useState("");
  const [inviteCode, setInviteCode] = useState(""); // For joining with a code
  const [inviteLink, setInviteLink] = useState(""); // Generated invite link
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const generateInviteCode = () => {
    return Math.random().toString(36).substring(2, 8).toUpperCase(); // Random 6-char code
  };

  const handleCreateGroup = async () => {
    if (!groupName.trim()) {
      setError("Please enter a group name");
      return;
    }
    
    setIsLoading(true);
    setError("");
    
    try {
      const code = generateInviteCode(); // Generate the invite code
      console.log("Creating group with name:", groupName, "and code:", code);
      
      const group = await createGroup(groupName, code); // Pass both arguments
      
      if (group) {
        console.log("Group created successfully:", group);
        setInviteCode(code); // Update the invite code state
        const link = `${window.location.origin}/join-group/${group.id}`;
        setInviteLink(link); // Set the generated link
      } else {
        setError("Failed to create group. Please try again.");
      }
    } catch (err) {
      console.error("Error creating group:", err);
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
      console.error("Error joining group:", err);
      setError("An error occurred. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-100">
      <div className="bg-white p-6 rounded-2xl shadow-lg w-full max-w-md">
        <h1 className="text-2xl font-bold text-center mb-4">Join or Create a Group</h1>

        <div className="space-y-4">
          {/* Create Group */}
          <div>
            <label className="block font-semibold">Create a new group</label>
            <input
              type="text"
              placeholder="Enter group name"
              value={groupName}
              onChange={(e) => setGroupName(e.target.value)}
              className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400"
            />
            <button
              className={`w-full mt-2 bg-blue-500 text-white py-2 rounded-xl hover:bg-blue-600 ${isLoading ? 'opacity-70 cursor-not-allowed' : ''}`}
              onClick={handleCreateGroup}
              disabled={isLoading}
            >
              {isLoading ? 'Creating...' : 'Create Group'}
            </button>

            {/* Show invite link & code after creation */}
            {inviteLink && (
              <div className="mt-3 p-3 bg-gray-200 rounded-lg text-center">
                <p className="text-sm">Invite Link:</p>
                <p className="font-semibold text-blue-600 break-words">{inviteLink}</p>
                <p className="text-sm mt-2">Invite Code: <span className="font-bold">{inviteCode}</span></p>
              </div>
            )}
          </div>

          {/* Join Group */}
          <div>
            <label className="block font-semibold">Join an existing group</label>
            <input
              type="text"
              placeholder="Enter group ID or Invite Code"
              value={groupId}
              onChange={(e) => setGroupId(e.target.value)}
              className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-green-400"
            />
            <button
              className={`w-full mt-2 bg-green-500 text-white py-2 rounded-xl hover:bg-green-600 ${isLoading ? 'opacity-70 cursor-not-allowed' : ''}`}
              onClick={handleJoinGroup}
              disabled={isLoading}
            >
              {isLoading ? 'Joining...' : 'Join Group'}
            </button>
          </div>
        </div>

        {error && <p className="mt-3 text-red-500 text-center">{error}</p>}
      </div>
    </div>
  );
};

export default GroupSelection;