import api from "../axiosApi";

export const myInfoApi = {
    get: async () => {
        const response = await api.get('/api/v1/user/info');
        return response.data.response;
    },

    set: async (formData) => {
        const response = await api.put(`/api/v1/user/info`, formData, {
                headers: { "Content-Type": "application/x-www-form-urlencoded" },
            });
        return response.data.response;
    },

    put: async (formData) => {
        const response = await api.put(`/api/v1/user/password/change`, formData, {
                headers: { "Content-Type": "application/x-www-form-urlencoded" },
            });
        return response.data.response;
    },

    delete: async () => {
        const response = await api.delete(`/api/v1/user/delete`);
        return response.data.response;
    }
}