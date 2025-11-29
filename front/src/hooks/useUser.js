import { useMutation, useQueryClient } from "@tanstack/react-query"
import { adminUserApi } from "../api/user/adminUserApi"
import CustomAlert from "../components/alert/CustomAlert";
import { loadingStore } from "../store/loadingStore";

export const useUser = () => {
    const queryClient = useQueryClient();

    const setLoading = loadingStore.getState().setLoading;

    const disabledUserMutation = useMutation({
        mutationFn: async({userId})=>{
            setLoading(true);
            const response = await adminUserApi.disabledUser(userId);
            return response;
        },
        onSuccess: ()=>{
            CustomAlert({
                text:"비활성화 처리 되었습니다."
            })
            queryClient.invalidateQueries({queryKey:['user']});
        },
        onError: (err) => {
            console.error(err);
            CustomAlert({
                text:"비활성화 처리에 실패하였습니다."
            })
        },
        onSettled: () => {
            setLoading(false);
        }
    })
    return{disabledUserMutation}
}