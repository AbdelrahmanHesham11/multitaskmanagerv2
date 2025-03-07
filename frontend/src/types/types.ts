// src/types/types.ts
export interface User {
    id: string;
    email?: string; // Make email optional
    username?: string;
  }
  
  export interface AuthResponse {
    data: {
      user: User | null;
      session: any | null; // Adjust this type if you have a specific Session type
    };
    error: Error | null;
  }

// src/types/types.ts
export interface Task {
  id: string;
  title: string;
  description: string;
  completed?: boolean;
  status?: string; // Optional
  user?: string;   // Optional
}
// src/types/types.ts
export interface Group {
  id: string;
  name: string;
}