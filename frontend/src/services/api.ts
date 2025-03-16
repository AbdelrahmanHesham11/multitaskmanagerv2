import { createClient } from '@supabase/supabase-js';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import DashboardGroup from '../pages/Dashboardgroup';
const supabaseUrl = 'https://xozoyskpunqygvaddboc.supabase.co';
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Inhvem95c2twdW5xeWd2YWRkYm9jIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDExMTY1NTMsImV4cCI6MjA1NjY5MjU1M30.h6VMizg9xaI342LH9dP-40zrWfgZdTI515JE-Y6g-IU';
export const supabaseClient = createClient(supabaseUrl, supabaseKey);

/**
 * ✅ Add a new task (Solo or Group mode)
 */
export const addTask = async (title: string, description: string = '', groupId: string | null = null) => {
  const { data: user, error: userError } = await supabaseClient.auth.getUser();
  if (userError || !user.user) {
    console.error('Error fetching user:', userError?.message);
    return null;
  }

  const taskData: any = {
    title,
    description,
    completed: false,
    created_at: new Date(),
  };

  if (groupId) {
    taskData.group_id = groupId; // Group mode
  } else {
    taskData.user = user.user.id; // Solo mode
  }

  const { data, error } = await supabaseClient.from('tasks').insert([taskData]).select();

  if (error) {
    console.error('Error adding task:', error);
    return null;
  }

  return data;
};

/**
 * ✅ Get tasks (Solo or Group mode)
 */
export const getTasks = async (groupId: string | null = null) => {
  const { data: user, error: userError } = await supabaseClient.auth.getUser();
  if (userError || !user.user) {
    console.error('Error fetching user:', userError?.message);
    return [];
  }

  let query = supabaseClient.from('tasks').select('*');

  if (groupId) {
    query = query.eq('group_id', groupId); // Group mode
  } else {
    query = query.eq('user', user.user.id); // Solo mode
  }

  const { data, error } = await query;

  if (error) {
    console.error('Error fetching tasks:', error);
    return [];
  }

  return data;
};

/**
 * ✅ Create a new group
 */
export const createGroup = async (groupName: string, inviteCode: string) => {
  try {
    const { data: user, error: userError } = await supabaseClient.auth.getUser();
    if (userError || !user.user) {
      console.error("❌ Error fetching user:", userError?.message);
      return null;
    }

    console.log("Creating group with name:", groupName, "and invite code:", inviteCode);

    // First, add the invite_code column if it doesn't exist
    // Note: This is a one-time operation you should run manually in Supabase SQL editor
    // await supabaseClient.rpc('add_invite_code_column_if_not_exists');

    const { data, error } = await supabaseClient
      .from("groups")
      .insert([{ 
        name: groupName, 
        invite_code: inviteCode, 
        created_by: user.user.id 
      }])
      .select()
      .single();

    if (error) {
      console.error("❌ Error creating group:", error.message);
      return null;
    }

    // Automatically add the creator to the group
    if (data) {
      const { error: memberError } = await supabaseClient
        .from('group_members')
        .insert([{ user_id: user.user.id, group_id: data.id }]);
        
      if (memberError) {
        console.error("❌ Error adding creator to group:", memberError.message);
        // We won't return null here as the group was still created
      }
    }

    console.log("Group created successfully:", data);
    return data;
  } catch (error) {
    console.error("❌ Unexpected error creating group:", error);
    return null;
  }
};

/**
 * ✅ Join a group by ID or invite code
 */
export const joinGroup = async (idOrCode: string) => {
  try {
    const { data: user, error: userError } = await supabaseClient.auth.getUser();
    if (userError || !user.user) {
      console.error('Error fetching user:', userError?.message);
      return false;
    }

    // Try to find the group by ID or invite code
    const { data: group, error: groupError } = await supabaseClient
      .from('groups')
      .select('id')
      .or(`id.eq.${idOrCode},invite_code.eq.${idOrCode}`)
      .single();

    if (groupError || !group) {
      console.error('Group not found:', groupError?.message);
      return false;
    }

    // Check if the user is already a member
    const { data: existingMember, error: memberCheckError } = await supabaseClient
      .from('group_members')
      .select('id')
      .eq('user_id', user.user.id)
      .eq('group_id', group.id)
      .single();

    if (existingMember) {
      console.log('User is already a member of this group');
      return true;
    }

    // Add user to the group
    const { error: joinError } = await supabaseClient
      .from('group_members')
      .insert([{ user_id: user.user.id, group_id: group.id }]);

    if (joinError) {
      console.error('Error joining group:', joinError);
      return false;
    }

    return true;
  } catch (error) {
    console.error('Unexpected error joining group:', error);
    return false;
  }
};

/**
 * ✅ Get groups the user is part of
 */
export const getUserGroups = async () => {
  const { data: user, error: userError } = await supabaseClient.auth.getUser();
  if (userError || !user.user) {
    console.error('Error fetching user:', userError?.message);
    return [];
  }

  const { data, error } = await supabaseClient
    .from('group_members')
    .select('group_id, groups!inner(id, name, invite_code)') // Include invite_code
    .eq('user_id', user.user.id);

  if (error) {
    console.error('Error fetching user groups:', error);
    return [];
  }

  return data;
};

/**
 * ✅ Add a new group task
 */
export const addGroupTask = async (title: string, description: string, groupId: string) => {
  const { data: { user } } = await supabaseClient.auth.getUser();

  if (!user) {
    console.error("No user found!");
    return;
  }

  const { error } = await supabaseClient
    .from("tasks")
    .insert([
      {
        title,
        description,
        completed: false,
        group_id: groupId,  // ✅ Ensures task is linked to the group
        user: user.id,       // ✅ Links task to the user
        created_at: new Date(),
      },
    ]);

  if (error) {
    console.error("Error adding group task:", error);
  }
};


/**
 * ✅ Get tasks for a specific group with user information
 */
export const getGroupTasks = async (groupId: string) => {
  const { data, error } = await supabaseClient
    .from('tasks')
    .select(`
      *,
      user_profile:profiles!profiles(username)
    `)
    .eq('group_id', groupId);

  if (error) {
    console.error('Error fetching group tasks:', error);
    return [];
  }
  return data;
};
/**
 * ✅ Mark task as completed
 */
export const markTaskAsCompleted = async (taskId: string) => {
  const { error } = await supabaseClient
    .from("tasks")
    .update({ completed: true })
    .eq("id", taskId);

  if (error) {
    console.error("Error marking task as completed:", error);
  }
};


/**
 * ✅ Delete completed tasks (Solo or Group)
 */
export const deleteCompletedTasks = async (groupId: string | null = null) => {
  const { data: user, error: userError } = await supabaseClient.auth.getUser();
  if (userError || !user.user) {
    console.error('Error fetching user:', userError?.message);
    return;
  }

  let query = supabaseClient.from('tasks').delete().eq('completed', true);

  if (groupId) {
    query = query.eq('group_id', groupId);
  } else {
    query = query.eq('user', user.user.id);
  }

  const { error } = await query;

  if (error) {
    console.error('Error deleting completed tasks:', error);
  } else {
    console.log('Completed tasks deleted successfully.');
  }
};

