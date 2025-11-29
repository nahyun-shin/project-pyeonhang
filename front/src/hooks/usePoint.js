import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useNavigate } from "react-router";
import { adminUserApi } from "../api/user/adminUserApi";
import { couponApi } from "../api/mypage/couponApi";
import CustomAlert from "../components/alert/CustomAlert";
import { loadingStore } from "../store/loadingStore";

export const usePoint = () => {
    const queryClient = useQueryClient();

    const setLoading = loadingStore.getState().setLoading; // 로딩 상태 변경 메서드

    const grantPointMutation = useMutation({
        mutationFn:async({ userId, amount, reason })=>{
            setLoading(true);
            const response = await adminUserApi.givePoint(userId, amount, reason);
            return response;
        },
        onSuccess : ()=>{
            queryClient.invalidateQueries({queryKey:['user']});
            queryClient.invalidateQueries({queryKey:['point']});
            CustomAlert({
                text: "포인트 지급 완료"
            });
        },
        onError:()=>{
            CustomAlert({
                text: "포인트 지급 중 오류가 발생했습니다."
            });
        },
        onSettled: () => {
            setLoading(false);
        },
    });

    const changePoint = useMutation({
        mutationFn : async(couponId)=>{
            setLoading(true);
            const response = await couponApi.change(couponId);
            return response;
        },
        onSuccess : ()=>{
            queryClient.invalidateQueries( {queryKey : ['point']});
            queryClient.invalidateQueries( {queryKey : ['coupon']});
            CustomAlert({
                text: "쿠폰 교환에 성공하였습니다."
            });
        },
        onError : (error)=>{
            console.error('쿠폰교환 실패', error);
            CustomAlert({
                text: "쿠폰 교환에 실패하였습니다."
            });
        },
        onSettled: () => {
            setLoading(false);
        }
    })


    return{grantPointMutation,changePoint};
}