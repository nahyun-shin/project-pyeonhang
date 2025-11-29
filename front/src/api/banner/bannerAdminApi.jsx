import api from "../axiosApi";
import { authStore } from "../../store/authStore";

const token = authStore.getState().token;

export const adminApi = {
  allList: async () => {
    const response = await api.get(`/api/v1/admin/Allbanner`);
    return response.data.response;
  },

  useList: async () => {
    const response = await api.get(`/api/v1/admin/useBanner`);
    return response.data.response;
  },

  // 등록, 수정 모두 create로 요청
  create: async (formData) => {
    const response = await api.post(`/api/v1/admin/banner`, formData, {
      headers: { "Content-Type": "multipart/form-data" },
      Authorization: `Bearer ${token}`,
    });
    return response.data.response;
  },
  delete: async (bannerId) => {
    const response = await api.delete(`/api/v1/admin/banner/${bannerId}`);
    return response.data.response;
  },
};
