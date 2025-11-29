import { useMutation, useQueryClient } from "@tanstack/react-query";
import { commentApi } from "../api/comment/commentApi";
import { loadingStore } from "../store/loadingStore";
import CustomAlert from "../components/alert/CustomAlert";

export const useComment=()=>{
    const queryClient = useQueryClient();

    const setLoading = loadingStore.getState().setLoading; // 로딩 상태 변경 메서드\

    const addCommentMutation = useMutation({
        mutationFn: async({crawlId, content})=>{
            setLoading(true);
            const response = await commentApi.postPrd(crawlId, content);
            return response;
        },
        onSuccess:()=>{
            queryClient.invalidateQueries(["product",]);
            CustomAlert({
                text: "댓글이 등록되었습니다."
            });
        },
        onError:()=>{
            CustomAlert({
                text: "댓글 등록에 실패하였습니다."
            });
        },
        onSettled: () => {
            setLoading(false);
        },

    });
    const updateCommentMutation = useMutation({
        mutationFn: async({commentId, content})=>{
            setLoading(true);
            const response = await commentApi.updatePrd(commentId, content);
            return response;
        },
        onSuccess:()=>{
            queryClient.invalidateQueries(["product"]);
            CustomAlert({
                text: "댓글이 수정되었습니다."
            });
        },
        onError:()=>{
            CustomAlert({
                text: "댓글이 수정에 실패하였습니다."
            });
        },
        onSettled:()=>{
            setLoading(false);
        }
    });

    const deleteCommentMutation = useMutation({
        mutationFn: async(commentId)=>{
            setLoading(true);
            const response = await commentApi.deletePrd(commentId);
            return response;
        },
        onSuccess: ()=>{
            queryClient.invalidateQueries(["product"]);
            CustomAlert({
                text: "댓글이 삭제되었습니다."
            });
        },
        onError:()=>{
            CustomAlert({
                text: "댓글이 삭제에 실패하였습니다."
            });
        },
        onSettled:()=>{
            setLoading(false);
        }
    })


    return{addCommentMutation,updateCommentMutation,deleteCommentMutation}
}