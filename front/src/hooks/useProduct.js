import { useMutation, useQueryClient } from "@tanstack/react-query"
import { wishApi } from "../api/mypage/wishApi";
import { adminPrdApi } from "../api/product/adminPrdApi";
import { useNavigate } from "react-router";
import CustomAlert from "../components/alert/CustomAlert";
import { loadingStore } from "../store/loadingStore";

export const useProduct =(productId)=>{
    const queryClient = useQueryClient();
    const navigate = useNavigate();

    const setLoading = loadingStore.getState().setLoading;

    const prdUpdateMutation = useMutation({
      mutationFn: async(formData) => {
        setLoading(true);
        const response = await adminPrdApi.update(productId, formData);
        return response;
      },
      onSuccess: () => {
          CustomAlert({
            text:"수정이 완료되었습니다!"
          })
          queryClient.invalidateQueries({queryKey:['product']})
          
      },
      onError: (error) => {
        console.error(error);
        CustomAlert({
            text:"수정 중 오류가 발생하였습니다."
        })
      },
      onSettled: ()=>{
        setLoading(false);
      }
    });

    const prdDeleteMutation = useMutation({
      mutationFn: async(productId)=> {
        setLoading(true);
        const response = await adminPrdApi.delete(productId);
        return response;
      },
      onSuccess : ()=>{
        CustomAlert({
            text:"상품이 삭제되었습니다."
        });
        queryClient.invalidateQueries({queryKey:['product']})
      },
      onError: (err) => {
        console.error(err);
        CustomAlert({
            text:"삭제 중 오류가 발생했습니다."
        });
      },
      onSettled: () => {
          setLoading(false);
      }
    })

    return {
        prdUpdateMutation,prdDeleteMutation,
    };
}