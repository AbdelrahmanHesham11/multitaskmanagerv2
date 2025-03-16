// src/types/types.ts


export interface User {
  id: string;
  email?: string; // Email is optional
  username?: string;
}


export interface AuthResponse {
  data: {
    user: User | null;
    session: any | null; 
  };
  error: Error | null;
}


export interface Task {
  id: string;
  title: string;
  description: string;
  status?: string; 
  completed?: boolean;
  group_id?: string; 
  created_at?: string;
  user?: string; 
  profiles?: {
    username: string;
  }; 
}

export interface Group {
  id: string;
  name: string;
  invite_code: string;
  created_by: string; 
}
