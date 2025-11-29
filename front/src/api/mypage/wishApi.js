import React from 'react';
import api from '../axiosApi';

export const wishApi= {
    list: async () => {
        const response = await api.get(`/api/v1/user/wish`);
        return response.data.response;
    },

    add: async(crawlId)=>{

        const response = await api.post(`/api/v1/user/wish?crawlId=${crawlId}`);
        return response.data.response;

    },
    
    delete: async(crawlId)=>{

        const response = await api.delete(`/api/v1/user/wish?crawlId=${crawlId}`);
        return response.data.response;

    },
}