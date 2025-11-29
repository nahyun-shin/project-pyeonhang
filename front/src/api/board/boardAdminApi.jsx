import React from 'react';
import api from '../axiosApi';


export const boardAdminApi = {
    delete: async(brdIdList) => {
        const response = await api.delete(`/api/v1/admin/board`, {
            data: {brdIdList : brdIdList },
            withCredentials: true // 세션 쿠키 보내기
        })
        return response; 
    },

    best: async(brdIdList) => {
        const response = await api.patch(`/api/v1/admin/board/best`, 
            { brdIdList: brdIdList },
            { withCredentials: true } // 세션 쿠키 보내기
        )
        return response; 
    },

    notice: async(brdIdList) => {
        const response = await api.patch(`/api/v1/admin/board/notice`, 
            { brdIdList: brdIdList },
            { withCredentials: true } // 세션 쿠키 보내기
        )
        return response; 
    },
}