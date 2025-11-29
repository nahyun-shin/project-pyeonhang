import React from 'react';
import api from '../axiosApi';

export const adminUserApi = {

    list: async({
        searchText,
        roleFilter,
        delYn,
        page,
        size
    })=>{
        const params = new URLSearchParams();
        params.set('page', page);
        params.set('size', size);
        if(searchText) params.set('searchText',searchText);
        if(roleFilter) params.set('roleFilter',roleFilter);
        if(delYn) params.set('delYn',delYn);
        const response = await api.get(
            `/api/v1/admin/user?${params.toString()}`
        )
        return response.data.response;
    },
    
    givePoint: async (userId, amount, reason) => {
        const response = await api.patch(
            `/api/v1/admin/${userId}/points`,
            null,
            {
            params: { amount, reason },
            }
        );
        return response.data;
    },
    
    disabledUser: async(userId)=>{
        const response = await api.put(`/api/v1/admin/${userId}`,null,
            {
                 headers: { "Content-Type": "application/json" },
            }
        );
        return response.data;
    }
}

