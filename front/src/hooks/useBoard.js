import { useMutation, useQuery } from "@tanstack/react-query"
import { boardApi } from "../api/board/boardApi";
import { boardAdminApi } from "../api/board/boardAdminApi";
import { useNavigate } from "react-router";
import { loadingStore } from "../store/loadingStore";
import CustomAlert from "../components/alert/CustomAlert";


export const useBoard = () => {
    const navigate = useNavigate();
    const setLoading = loadingStore.getState().setLoading;

    const getMutate = useMutation({
        mutationFn: async (brdId) => {
            setLoading(true);
            const response = await boardApi.get(brdId);
            console.log(response)
            return response.data.response; 
        },
        onError: (error) => {
            console.error("게시글 상세 가져오기 실패", error.response.data.response);
            CustomAlert({
                text: "게시글 상세 가져오기 실패"
            })
        },
        onSettled: () => {
            setLoading(false);
        }         
    });

    const useBoardList = ({ sortType, searchType, keyword, page, size }) => {
        return useQuery({
            queryKey: ['boardList', sortType, searchType, keyword, page, size],
            queryFn: async () => {
                const response = await boardApi.list({ sortType, searchType, keyword, page, size });
                return response.data.response;
            },
            onError: (error) => {
                console.error("게시판 리스트 가져오기 실패", error.response?.data?.response);
                CustomAlert({
                    text: "게시판 리스트 가져오기 실패"
                });
            }
        });
    };

    const createMutate = useMutation({
        mutationFn: async () => {
            setLoading(true);
            const response = await boardApi.create();
            console.log(response)
            return response.data.response.boardId;
        },
        
        onError: (error) => {
             console.error("게시판 등록 실패", error.response.data.response);
            CustomAlert({
                text: error.response.data.response
            })
        },
        onSettled: () => {
            setLoading(false);
        } 
    });

    const uploadImgMutate = useMutation({
        mutationFn: async ({brdId, formData}) => {
            setLoading(true);
            const response = await boardApi.imageCreate(formData, brdId);
            return response.data.response;
        },
        onSuccess: (data) => {
            console.log(data)
            console.log('이미지 업로드 성공')
        },
        onError: (error) => {
            console.error("이미지 업로드 실패", error);
            CustomAlert({
                text: "이미지 업로드 실패"
            })
        },
        onSettled: () => {
            setLoading(false);
        }        
    })

    // 이미지 리사이징 요청
    const resizeImgMutation = useMutation({
        mutationFn: async ({brdId, formData}) => {
            setLoading(true);
            const response = await boardApi.imageCreate(formData, brdId);
            return response.data.response;
        },
        onSuccess: (data) => {
            console.log(data)
            console.log('이미지 리사이징 성공')
        },
        onError: (error) => {
            console.error("이미지 리사이징 실패", error);
            CustomAlert({
                text: "이미지 리사이징 실패"
            })
        },
        onSettled: () => {
            setLoading(false);
        } 
    });

    const updateMutate = useMutation({
        mutationFn: async ({brdId, formData}) => {
            setLoading(true);
            const response = await boardApi.update(brdId, formData);
            return response.data.response.content;
        },
        onSuccess: ()=>{
            CustomAlert({
                text: "게시글이 등록되었습니다!"
            })
        },
        onError: (error) => {
            console.error("게시글 작성 실패", error);
            CustomAlert({
                text: "게시글 작성 실패"
            })
        },
        onSettled: () => {
            setLoading(false);
        } 
    });

    const deleteMutate = useMutation({
        mutationFn: async (brdId) => {
            setLoading(true);
            const response = await boardApi.delete(brdId);
            return response.data.response;
        },
        onSuccess: (data) => {
            // CustomAlert({
            //     text: "게시글을 삭제하였습니다."
            // })
        },
        onError: (error) => {
            console.error("게시글 삭제 실패", error);
        },
        onSettled: () => {
            setLoading(false);
        } 
    });    
     
    const bestMutate = useMutation({
        mutationFn: async (brdId) => {
            setLoading(true);
            const response = await boardApi.best(brdId);
            return response.data.response;
        },
        // onSuccess: (data) => {
        //     alert('추천되었습니다!')
        // },
        onError: (error) => {
            console.log(error)
            CustomAlert({
                text: error.response.data.response
            })
        },
        onSettled: () => {
            setLoading(false);
        } 
    });      

    const deleteImgMutate = useMutation({
        mutationFn: async (brdId, cloudinaryId) => {
            setLoading(true);
            const response = await boardApi.imageDelete(brdId, cloudinaryId);
            return response.data.response;
        },
        onSuccess: (data) => {
            console.log(data)
        },
        
        onError: (error) => {
            console.error("댓글 불러오기 실패", error);
            CustomAlert({
                text: "댓글 불러오기 실패"
            })
        },
        onSettled: () => {
            setLoading(false);
        } 
    })

    const listCommentMutate = useMutation({
        mutationFn: async (brdId) => {
            setLoading(true);
            const response = await boardApi.listComment(brdId);
            return response.data.response;
        },
        onSuccess: (data) => {
            console.log(data)
        },
        
        onError: (error) => {
            console.error("댓글 불러오기 실패", error);
            CustomAlert({
                text: "댓글 불러오기 실패"
            })
        },
        onSettled: () => {
            setLoading(false);
        } 
    })

    const createCommentMutate = useMutation({
        mutationFn: async ({brdId, formData}) => {
            setLoading(true);
            console.log(brdId)
            const response = await boardApi.createComment(brdId, formData);
            return response.data.response;
        },
        onSuccess: (data) => {
            console.log(data)
            CustomAlert({
                text: "댓글을 등록했습니다."
            })
        },
        
        onError: (error) => {
            console.error("댓글 작성 실패", error);
            CustomAlert({
                text: "댓글 작성 실패"
            })
        },
        onSettled: () => {
            setLoading(false);
        } 
    });

    const updateCommentMutate = useMutation({
        mutationFn: async ({commentId, formData}) => {
            setLoading(true);
            const response = await boardApi.updateComment(commentId, formData);
            return response.data.response;
        },
        onSuccess: (data) => {
            console.log(data)
            CustomAlert({
                text: "댓글을 수정했습니다."
            })
        },
        
        onError: (error) => {
            console.error("댓글 수정 실패", error);
            CustomAlert({
                text: "댓글 수정 실패"
            })
        },
        onSettled: () => {
            setLoading(false);
        } 
    });

    const deleteCommentMutate = useMutation({
        mutationFn: async (commentId) => {
            setLoading(true);
            const response = await boardApi.deleteComment(commentId);
            return response.data.response;
        },
        onSuccess: (data) => {
            console.log(data)
            CustomAlert({
                text: "댓글을 삭제했습니다."
            })
        },
        
        onError: (error) => {
            console.error("댓글삭제 실패", error);
            CustomAlert({
                text: "댓글삭제 실패"
            })
        },
        onSettled: () => {
            setLoading(false);
        } 
    });    

    return { 
        getMutate,
        useBoardList, 
        createMutate, 
        uploadImgMutate, 
        updateMutate, 
        deleteMutate, 
        deleteImgMutate,
        bestMutate,
        resizeImgMutation,
        listCommentMutate,
        createCommentMutate,
        updateCommentMutate,
        deleteCommentMutate
     }
}
