import api from "../axiosApi";


export const couponAdminApi = {
    list: async() => {
        const response = await api.get(`/api/v1/admin/coupon`);
        return response;
    },

    create: async(formData) => {
        const response = await api.post(`/api/v1/admin/coupon`, formData, {
            headers: {"Content-Type" : "multipart/form-data"},
        });
        return response;
    },

    update: async(couponId, formData) => {
        const response = await api.put(`/api/v1/admin/coupon/${couponId}`, formData, {
            headers: {"Content-Type" : "multipart/form-data"},
        });
        return response;
    },

    delete: async(couponIds) => {
        const response = await api.delete(`/api/v1/admin/coupon`, {
            headers: {"Content-Type": "application/json"},
            data: {ids: couponIds}
        });
        return response;
    },

    requestList: async({
        size=10, 
        page = 0, 
        sort = 'acquiredAt,desc'
    })=>{
        const params = new URLSearchParams();

        params.set('size', size);
        params.set('page', page);
        params.set('sort', sort);
        const response = await api.get(`/api/v1/admin/user/coupon?${params.toString()}`);

        return response.data.response;
    },
};