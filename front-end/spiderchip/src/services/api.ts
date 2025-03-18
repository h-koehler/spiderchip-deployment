import axios from "axios";

const api = axios.create({
    baseURL: 'http://localhost:4000/api'
});

export const setAuthToken = (token: string | null) => {
    if (token) {
        localStorage.setItem("token", token);
        api.defaults.headers.common["Authorization"] = `Bearer ${token}`;
    } else {
        localStorage.removeItem("token");
        delete api.defaults.headers.common["Authorization"];
    }
};

export default api;