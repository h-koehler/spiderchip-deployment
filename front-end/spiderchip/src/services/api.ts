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

export const getUserLevels = () => {
    // TODO
}

export const saveUserProgress = async (progress: {
    userId: string;
    levelId: string;
    completed: boolean;
    currentSolution?: string;
    testCaseResults: Array<{
        testCaseId: number;
        passed: boolean;
        lastAttempt?: Date;
    }>;
}) => {
    const response = await api.post('/levels/progress', progress);
    return response.data;
};

export const getLevelProgress = async (userId: string, levelId: string) => {
    const response = await api.get(`/levels/${levelId}/progress/${userId}`);
    return response.data;
};

export default api;