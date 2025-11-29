import { useMutation, useQueryClient } from "@tanstack/react-query";
import { adminApi } from "../api/banner/bannerAdminApi";
import { couponAdminApi } from "../api/coupon/couponAdminApi";
import CustomAlert from "../components/alert/CustomAlert";
import { loadingStore } from "../store/loadingStore";
import { boardAdminApi } from "../api/board/boardAdminApi";

export const useAdmin = () => {
  const queryClient = useQueryClient();

  const setLoading = loadingStore.getState().setLoading; // 로딩 상태 변경 메서드


  const getBannerListMutation = useMutation({
    mutationFn: async () => {
        setLoading(true);
        const response = await adminApi.allList();
        return response;
    },
    onSuccess: (data) => {
      queryClient.invalidateQueries(["bannerList"]); // 캐시 갱신
    },
    onSettled: () => {
      setLoading(false);
    }
  });

  const createBannerMutation = useMutation({
    mutationFn: async (formData) => {
        setLoading(true);
        const response = await adminApi.create(formData);
        return response;
    },
    onSuccess: (data) => {
      queryClient.invalidateQueries(["bannerList"]); // 캐시 갱신
    },
    onSettled: (data, error) => {
      console.log(data);
      console.log(error);
      setLoading(false);
      const msg = data && !error ? data.resultMessage : error.response.data.response;
      CustomAlert({
        text: msg ||  error?.message
      });
    }
  });

  const deleteBannerMutation = useMutation({
    mutationFn: async (bannerId) => {
      setLoading(true);
      const response = await adminApi.delete(bannerId);
      return response;
    },
    onSuccess: () => {
      CustomAlert({
        text: "배너가 삭제되었습니다!"
      });
    },
    onError: (error) => {
      console.error("배너 삭제 실패:", error.response.data.response?.data);
      CustomAlert({
        text: "배너 삭제 실패"
      });
    },
    onSettled:()=>{
      setLoading(false);
    }    
  });

  const getCouponListMutation = useMutation({
    mutationFn: async () => {
      setLoading(true);
      const response = await couponAdminApi.list();
      return response;
    },
    mutationKey: ['coupon', 'list'], // 중복 요청 막음
    onSuccess: () => {
      console.log('쿠폰 리스트 불러오기 완료')
    },
    onError:(error)=>{
      console.log(error.response.data.response);
      CustomAlert({
        text: "쿠폰 리스트 불러오기에 실패하였습니다."
      });
    },
    onSettled: () => {
      setLoading(false);
    }     
  });

  const createCouponMutation = useMutation({
    mutationFn: async (formData) => {
      setLoading(true);
      const response = await couponAdminApi.create(formData);
      return response;
    },
    mutationKey: ['coupon', 'create'], // 중복 요청 막음
    onSuccess:(data)=>{
      CustomAlert({
        text: data.data.response.resultMessage
      })
    },
    onError:(error)=>{
      console.error(error.response.data.response);
      CustomAlert({
        text: "쿠폰 등록에 실패하였습니다."
      })
    },
    onSettled: () => {
      setLoading(false);
    }    
  });

  const updateCouponMutation = useMutation({
    mutationFn: async (formData) => {
      setLoading(true);
      console.log(formData)
      const response = await couponAdminApi.update(formData.couponId, formData);
      console.log(response);
      return response;
    },
    mutationKey: ['coupon', 'update'], // 중복 요청 막음
    onSuccess:(data)=>{
      CustomAlert({
        text: data.data.response.resultMessage
      })
    },
    onError:(error)=>{
      console.error(error.response.data.response);
      CustomAlert({
        text: "쿠폰 수정에 실패하였습니다."
      })
    },
    onSettled: () => {
      setLoading(false);
    }    
  })  

  const deleteCouponMutation = useMutation({
    mutationFn: async(couponIds) => {
      setLoading(true);
      const response = await couponAdminApi.delete(couponIds);
      console.log(response);
      return response;
    },
    mutationKey: ['coupon', 'delete'], // 중복 요청 막음
    onSuccess:(data)=>{
      CustomAlert({
        text: data.data.response.resultMessage
      })
    },
    onError:(error)=>{
      console.error(error.response.data.response);
      CustomAlert({
        text: "쿠폰 삭제에 실패하였습니다"
      })
    },
    onSettled: () => {
      setLoading(false);
    }      
  })

  const deleteBoardMutate = useMutation({
      mutationFn: async (brdIdList) => {
          setLoading(true);
          const response = await boardAdminApi.delete(brdIdList);
          return response.data.response;
      },
      onSuccess: (data) => {
          CustomAlert({
            text:"게시글 삭제를 완료하였습니다."
          });
      },
      
      onError: (error) => {
          console.error("게시글 삭제 실패", error.response.data.response);
          CustomAlert({
            text:"게시글 삭제에 실패하였습니다."
          });
      },
      onSettled: () => {
        setLoading(false);
      } 
  });  


  const bestBoardMutate = useMutation({
      mutationFn: async (brdIdList) => {
        setLoading(true);
        const response = await boardAdminApi.best(brdIdList);
        return response.data.response;
      },
      onSuccess: (data) => {
        console.log(data)
        CustomAlert({
          text: data.resultMessage
        });
      },
      
      onError: (error) => {
        console.error("게시글 채택에 실패하였습니다.", error);
      },
      onSettled: () => {
        setLoading(false);
      } 
  }); 

  const noticeBoardMutate = useMutation({
      mutationFn: async (brdIdList) => {
        setLoading(true);
        const response = await boardAdminApi.notice(brdIdList);
        return response.data.response;
      },
      onSuccess: (data) => {
        console.log(data)
        CustomAlert({
          text: data.resultMessage
        })
      },
      onError: (error) => {
        console.error("게시글 공지 등록 실패", error);
        console.log(error)
        CustomAlert({
          text: error.response.data.response.data.response
        })
      },
      onSettled: () => {
        setLoading(false);
      } 
  }); 



  return { 
    getBannerListMutation, 
    createBannerMutation, 
    deleteBannerMutation, 
    getCouponListMutation, 
    createCouponMutation, 
    updateCouponMutation, 
    deleteCouponMutation ,
    deleteBoardMutate,
    bestBoardMutate,
    noticeBoardMutate
  };
};
