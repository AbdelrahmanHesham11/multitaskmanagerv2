import { createClient } from '@supabase/supabase-js';
const supabaseUrl = "******;"
const supabaseKey = "******";
export const supabaseClient = createClient(supabaseUrl, supabaseKey);


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
    taskData.group_id = groupId; 
  } else {
    taskData.user = user.user.id; 
  }

  const { data, error } = await supabaseClient.from('tasks').insert([taskData]).select();

  if (error) {
    console.error('Error adding task:', error);
    return null;
  }

  return data;
};


export const getTasks = async (groupId: string | null = null) => {
  const { data: user, error: userError } = await supabaseClient.auth.getUser();
  if (userError || !user.user) {
    console.error('Error fetching user:', userError?.message);
    return [];
  }

  let query = supabaseClient.from('tasks').select('*');

  if (groupId) {
    query = query.eq('group_id', groupId); 
  } else {
    query = query.eq('user', user.user.id); 
  }

  const { data, error } = await query;

  if (error) {
    console.error('Error fetching tasks:', error);
    return [];
  }

  return data;
};


export const createGroup = async (groupName: string, inviteCode: string) => {
  try {
    const { data: user, error: userError } = await supabaseClient.auth.getUser();
    if (userError || !user.user) {
      console.error(" Error fetching user:", userError?.message);
      return null;
    }

    console.log("Creating group with name:", groupName, "and invite code:", inviteCode);


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
      console.error("Error creating group:", error.message);
      return null;
    }

    if (data) {
      const { error: memberError } = await supabaseClient
        .from('group_members')
        .insert([{ user_id: user.user.id, group_id: data.id }]);
        
      if (memberError) {
        console.error("❌ Error adding creator to group:", memberError.message);

      }
    }

    console.log("Group created successfully:", data);
    return data;
  } catch (error) {
    console.error("❌ Unexpected error creating group:", error);
    return null;
  }
};


export const joinGroup = async (idOrCode: string) => {
  try {
    const { data: user, error: userError } = await supabaseClient.auth.getUser();
    if (userError || !user.user) {
      console.error('Error fetching user:', userError?.message);
      return false;
    }


    const { data: group, error: groupError } = await supabaseClient
      .from('groups')
      .select('id')
      .or(`id.eq.${idOrCode},invite_code.eq.${idOrCode}`)
      .single();

    if (groupError || !group) {
      console.error('Group not found:', groupError?.message);
      return false;
    }


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


export const getUserGroups = async () => {
  const { data: user, error: userError } = await supabaseClient.auth.getUser();
  if (userError || !user.user) {
    console.error('Error fetching user:', userError?.message);
    return [];
  }

  const { data, error } = await supabaseClient
    .from('group_members')
    .select('group_id, groups!inner(id, name, invite_code)') 
    .eq('user_id', user.user.id);

  if (error) {
    console.error('Error fetching user groups:', error);
    return [];
  }

  return data;
};

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
        group_id: groupId, 
        user: user.id,       
        created_at: new Date(),
      },
    ]);

  if (error) {
    console.error("Error adding group task:", error);
  }
};


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

export const markTaskAsCompleted = async (taskId: string) => {
  const { error } = await supabaseClient
    .from("tasks")
    .update({ completed: true })
    .eq("id", taskId);

  if (error) {
    console.error("Error marking task as completed:", error);
  }
};



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

