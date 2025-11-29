import { QueryClient, useMutation, useQueryClient } from "@tanstack/react-query";
import { authStore } from "../store/authStore"
import { useNavigate } from "react-router";
import { loginApi } from "../api/login/loginApi";
import CustomAlert from "../components/alert/CustomAlert";
import { loadingStore } from "../store/loadingStore";



export const useLogin = () => {
    const{setLogin} = authStore();
    const navigate = useNavigate();
    const queryClient = useQueryClient();

    const setLoading = loadingStore.getState().setLoading;

    const joinMutation = useMutation({
        mutationFn: async(formData) => {
            setLoading(true);
            const response = await loginApi.create(formData);
            return response;
        },
        onSuccess : (data) =>{
            console.log(data);
        },
        onError : (error) =>{
            console.error('회원가입 실패', error);
            CustomAlert({
                text: error.response.data.response 
            })
        },
        onSettled: () => {
            setLoading(false);
        }
    })

    const loginMutation =  useMutation({
        mutationFn :  async (formData) => {
            setLoading(true);
            const response = await loginApi.login(formData);
            return response;
        },
        onSuccess : (data) =>{
            //캐시무효화 
            queryClient.invalidateQueries( {queryKey : ['users']});

            //토큰 저장
            setLogin(data.data.content);

            // 로그인 후 즉시 권한별 페이지 이동
            if (data.data.content.userRole === "ROLE_ADMIN") {
                navigate("/admin"); // 관리자면 관리자 페이지
            } else {
                navigate("/"); // 일반 사용자면 메인 페이지
            }
        },
        onError : (error) =>{
            console.error('Login 실패', error);
            CustomAlert({
                text: "아이디 또는 비밀번호가 올바르지 않습니다. 다시 확인해주세요."
            });
        },
        onSettled: () => {
            setLoading(false);
        }
    });

    const findIdMutation = useMutation({
        mutationFn: async(formData) => {
            setLoading(true);
            const params = new URLSearchParams(formData).toString();
            const response = await loginApi.findId(params);

            return response.data.response;
        },
        onSuccess: (data) => {
            console.log("아이디 찾기 성공", data);
        },
        onError: (error)=>{
            console.error("아이디 찾기 실패", error);
        },
        onSettled: () => {
            setLoading(false);
        }
    })

    const findPwMutation = useMutation({
        mutationFn: async(formData) => {
            setLoading(true);
            const response = await loginApi.findPw(formData);
            return response.data.response;
        },

        onSuccess: (data) => {
            CustomAlert({ text : data});
        },
        onError: (error)=>{
            console.error("비밀번호 찾기 실패", error);
        },
        onSettled: () => {
            setLoading(false);
        }
    });

    const confirmEmailCodeMutation = useMutation({
        mutationFn: async(formData) => {
            setLoading(true);
            const response = await loginApi.confirmEmailCode(formData);
            return response.data.response;
        },
        onSettled: () => {
            setLoading(false);
        }
    });

    const newPwMutation = useMutation({
        mutationFn: async(formData) => {
            setLoading(true);
            const response = await loginApi.newPw(formData);
            return response.data.response;
        },

        onSuccess: (data) => {
            console.log("비밀번호 변경 성공");
            console.log(data);
        },
        onError:(error)=>{
            console.error("비밀번호 변경 실패", error);
        },
        onSettled: () => {
            setLoading(false);
        }
    })    

    return { joinMutation, loginMutation, findIdMutation, findPwMutation, newPwMutation, confirmEmailCodeMutation };
}