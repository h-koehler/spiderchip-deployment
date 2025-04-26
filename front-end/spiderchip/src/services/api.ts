import axios from "axios";

const TOKEN_STORAGE_KEY = "auth-user-token";

const api = axios.create({
    baseURL: 'http://localhost:4000/api'
});

let userId: string | null = null;

const prepAuthorization = () => {
    const token = localStorage.getItem(TOKEN_STORAGE_KEY);
    if (token) {
        api.defaults.headers.common["Authorization"] = `Bearer ${token}`;
        userId = parseToken(token).id;
    } else {
        delete api.defaults.headers.common["Authorization"];
        userId = null;
    }
}

export const setAuthToken = (token: string | null) => {
    if (token) {
        localStorage.setItem(TOKEN_STORAGE_KEY, token);
    } else {
        localStorage.removeItem(TOKEN_STORAGE_KEY);
    }
    prepAuthorization();
};

const parseToken = (token: string): { id: string, iat: number, exp: number } => {
    return JSON.parse(atob(token.split('.')[1]).toString());
}

export const getCurrentUserId = (): string | null => {
    // use the one we've memoized
    if (userId) {
        return userId;
    }
    // don't seem to have one - that's weird, but read from storage
    const token = localStorage.getItem(TOKEN_STORAGE_KEY);
    if (token) {
        return parseToken(token).id;
    } else {
        return null;
    }
}

export const isAuthenticated = (): boolean => {
    return !!localStorage.getItem(TOKEN_STORAGE_KEY);
}

// bootstrapping ourselves
prepAuthorization();

export default api;
