export interface User {
    id: string;
    first_name: string;
    last_name: string;
    email: string;
    password: string;
    created_at?: Date;
    updated_at: Date;
}

export interface UserAuth {
    id: string;
    email: string;
    password: string;
}
  
export interface UserResponse {
    id: string;
}