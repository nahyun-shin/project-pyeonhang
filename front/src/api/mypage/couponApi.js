import api from "../axiosApi";

export const couponApi = {
    list : async() => {
        const response = await api.get('/api/v1/user/coupon/my');
        return response.data.response;
    },
    change:async(couponId)=>{
        const response = await api.post(`/api/v1/user/coupon/${couponId}`);
        return response.data.response;
    }
}