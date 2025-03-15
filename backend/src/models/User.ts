export interface User {
    id: string;
    username: string;
    email: string;
    password: string;
    role?: string;
    created_at?: Date;
    updated_at: Date;
}

export interface UserAuth {
    id: string;
    email: string;
    hashed_password: string;
}
  
export interface UserResponse {
    token: string;
}