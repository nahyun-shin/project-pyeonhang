import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { toast } from "react-toastify";
import { authStore } from "../store/authStore";
import { wishApi } from "../api/mypage/wishApi";
import { useEffect, useMemo } from "react";
import { loadingStore } from "../store/loadingStore";

export const useWish = () => {
  const queryClient = useQueryClient();
  const isAuth = authStore().isAuthenticated();

  const setLoading = loadingStore.getState().setLoading;
  const isLoading = loadingStore(state => state.loading); // 요청에 대한 로딩 상태

  // 찜 리스트 fetch
  const { data: wishData = { content: [], count: 0 }, isLoading : wishLoading } = useQuery({
    queryKey: ["wish"],
    queryFn: async () => {
      const res = await wishApi.list();
      return res;
    },
    enabled: isAuth,
  });

  useEffect(() => {
    setLoading(wishLoading);
  }, [wishLoading]);

  // 빠른 조회용 Set
  const wishSet = useMemo(() => new Set(wishData.content.map(item => item.crawlId)), [wishData]);

  // 찜 토글
  const toggleWishMutation = useMutation({
    mutationFn: async (product) => {
      setLoading(true);
      const exists = wishSet.has(product.crawlId);
      return exists
        ? await wishApi.delete(product.crawlId)
        : await wishApi.add(product.crawlId);
    },
    onMutate: async (product) => {
      await queryClient.cancelQueries(["wish"]);
      const previousWish = queryClient.getQueryData(["wish"]);

      queryClient.setQueryData(["wish"], old => {
        const content = old?.content || [];
        if (wishSet.has(product.crawlId)) {
          return { ...old, content: content.filter(i => i.crawlId !== product.crawlId), count: (old.count || 0) - 1 };
        } else {
          return { ...old, content: [...content, product], count: (old.count || 0) + 1 };
        }
      });

      return { previousWish };
    },
    onError: (err, product, context) => {
      queryClient.setQueryData(["wish"], context.previousWish);
      toast.error("찜 처리 실패");
    },
    onSuccess: (data) => {
      console.log(data);
      if(data.resultMessage === "ADDED"){
        toast.success("찜이 추가되었습니다 :)");
      }
      if(data.resultMessage === "REMOVED"){
        toast.warning("찜이 삭제되었습니다 :)");
      }
      
    },
    onSettled: () => {
      queryClient.invalidateQueries(["wish"])
      setLoading(false);
    },
  });

  return {
    wishList: wishData.content,
    wishCount: wishData.count,
    isWish: (crawlId) => wishSet.has(crawlId),
    toggleWishMutation,
  };
};
