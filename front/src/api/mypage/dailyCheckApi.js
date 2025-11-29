import api from "../axiosApi";

export const dailyCheckApi = {
    list : async() => {
        const response = await api.get('/api/v1/user/attendance');
        return response.data.response;
    },
}