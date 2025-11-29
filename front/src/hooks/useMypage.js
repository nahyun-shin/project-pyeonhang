import { QueryClient, useMutation, useQueryClient } from "@tanstack/react-query";
import { authStore } from "../store/authStore"
import api from '../api/axiosApi';
import { useNavigate } from "react-router";
import { myInfoApi } from "../api/mypage/myInfoApi";
import { dailyCheckApi } from "../api/mypage/dailyCheckApi";
import CustomAlert from "../components/alert/CustomAlert";
import { loadingStore } from "../store/loadingStore";


export const useMypage = () => {
    const navigate = useNavigate();
    const queryClient = useQueryClient();

    const setLoading = loadingStore.getState().setLoading; // 로딩 상태 변경 메서드

    const { clearAuth } = authStore();

    const getMyInfoMutation = useMutation({
        mutationFn: async() => {
            setLoading(true);
            const response = await myInfoApi.get();
            return response;
        },

        onSuccess: (data) => {
            console.log("내 정보 가져오기 완료");
        },
        onError:(error)=>{
            CustomAlert({
                text: error.response.data.message || error.response.data
            })
        },
        onSettled: () => {
            setLoading(false);
        }
    })

    const setMyInfoMutation = useMutation({
        mutationFn: async(formData) => {
            setLoading(true);
            const response = await myInfoApi.set(formData);

            return response;
        },
        onSuccess:(data)=>{
            CustomAlert({
                text: "내 정보가 수정되었습니다."
            })
        },
        onError:(error)=>{
            CustomAlert({
                text: error?.message || error.response.data.response
            })
        },
        onSettled: () => {
            setLoading(false);
        }
    })    

    const newMypwMutation = useMutation({
        mutationFn: async(formData) => {
            setLoading(true);
            const response = await myInfoApi.put(formData);
            return response;
        },

        onSuccess: (data) => {
            console.log(data);
            CustomAlert({
                text:"비밀번호 변경이 완료되었습니다."
            })
        },
        onError:(error)=>{
            CustomAlert({
                text: error.response.data.response || error.response.data
            })
        },
        onSettled: () => {
            setLoading(false);
        }
    })

    const deleteUserMutation = useMutation({
        mutationFn: async() => {
            setLoading(true);
            const response = await myInfoApi.delete();
            return response;
        },
        onSuccess: (data) => {
            console.log(data)
            CustomAlert({
                text: data
            })
            clearAuth();
            navigate('/');
        },
        onError:(error)=>{
            console.log(error)
            CustomAlert({
                text: error
            })
        },
        onSettled: () => {
            setLoading(false);
        }
    })

    const dailyCheckListMutation = useMutation({
        mutationFn: async() => {
            setLoading(true);
            const response = await dailyCheckApi.list();
            return response;
        },
        onSuccess: (data) => {
        console.log(data)
        },
        onError:(error)=>{
            
            console.log(error)
            CustomAlert({
                text: error.response.data.response
            }) 
        },
        onSettled: () => {
            setLoading(false);
        }       
    })

    return { getMyInfoMutation, setMyInfoMutation, newMypwMutation, deleteUserMutation, dailyCheckListMutation }
}