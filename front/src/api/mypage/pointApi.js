import React from 'react';
import api from '../axiosApi';

export const pointApi= {
    list: async () => {
        const response = await api.get(`/api/v1/user/points`);
        return response.data.response;
    },
}