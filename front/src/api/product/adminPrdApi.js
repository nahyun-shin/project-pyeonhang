import React from 'react';
import api from '../axiosApi';

export const adminPrdApi = {
    
    update: async(crawlId,dto)=>{
        const response = await api.patch(
            `/api/v1/crawl/${crawlId}`,dto,
            {
                 headers: { "Content-Type": "application/json" },
            }
        )
        return response.data;
    },
    
    delete: async(crawlId)=>{
        const response = await api.delete(`/api/v1/crawl/${crawlId}`);
        return response.data;
    }
}

