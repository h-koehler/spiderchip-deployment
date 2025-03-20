export interface User {
    id: string;
    username: string;
    email: string;
    hashed_password: string;
    role_id: string;
    created_at: Date | null;
    updated_at: Date | null;
}

export interface UserAuth {
    id: string;
    email: string;
    hashed_password: string;
}

export interface UserRequest {
    username: string;
    email: string;
    password: string;
}

export interface UserResponse {
    token: string;
}