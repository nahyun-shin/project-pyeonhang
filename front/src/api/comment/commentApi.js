import api from "../axiosApi";

export const commentApi = {
    postPrd: async(crawlId,content)=>{
        
        const params = new URLSearchParams();
        params.set('content', content);

        const response = await api.post(`/api/v1/crawl/${crawlId}/comment?${params.toString()}`,
            {
                headers: { "Content-Type": "application/x-www-form-urlencoded" }
            }
        );
        return response.data;
    },
    updatePrd : async(commentId , content)=>{
        const params = new URLSearchParams();
        params.set('content', content);
        const response = await api.put(`/api/v1/crawl/comment/${commentId}?${params.toString()}`,
            {
                headers: { "Content-Type": "application/x-www-form-urlencoded" }
            }
        );
        return response.data;
    },
    deletePrd : async(commentId)=>{
        const response = await api.delete(`/api/v1/crawl/comment/${commentId}`);
        return response.data;
    },
};