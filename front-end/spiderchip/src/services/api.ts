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

// Get all levels with progress status for a user
export const getUserLevels = async (userId: string) => {
    const response = await api.get(`/levels/all/${userId}`);
    return response.data;
};

// Save all user progress at once
export const saveAllUserProgress = async (userId: string, progress: Array<{
    levelId: string,
    status: string
}>) => {
    const response = await api.post(`/levels/all/${userId}`, progress);
    return response.data;
};

// Get progress for a specific level
export const getLevelProgress = async (userId: string, levelId: string) => {
    const response = await api.get(`/levels/${levelId}/${userId}`);
    return response.data;
};

// Save progress for a specific level
export const saveLevelProgress = async (userId: string, levelId: string, progress: {
    status: string,
    code: string
}) => {
    const response = await api.post(`/levels/${levelId}/${userId}`, progress);
    return response.data;
};

export default api;