import React from 'react';
import api from '../axiosApi';

export const loginApi = {
    create: async(formData) => {
        const response = await api.post(`/api/v1/user/add`, formData, {
            headers: {"Content-Type" : "multipart/form-data"},
        });
        return response;

    },

    login: async(formData) => {
        const response = await api.post(`/api/v1/user/login`, formData, {
            headers: { "Content-Type": "application/x-www-form-urlencoded" },
        });
        return response;
    },

    findId: async(params) => {
        const response = await api.get(`/api/v1/user/findId?${params}`, {
            headers: { "Content-Type": "application/x-www-form-urlencoded" },
        });
        return response;
    },

    findPw: async(formData) => {
        const response = api.post(`/api/v1/user/password/findPw`, formData, {
            headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
            withCredentials: true // 세션 쿠키 보내기
        });
        return response;
    },

    confirmEmailCode: async(formData) => {
        const response = api.post(`/api/v1/user/password/confirmCode`, formData, {
            headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
            withCredentials: true // 세션 쿠키 보내기
        });
        return response;
    },

    newPw: async(formData) => {
        const response = api.post(`/api/v1/user/password/reset`, formData, {
            headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
            withCredentials: true // 세션 쿠키 보내기
        });
        return response;
    }
};
