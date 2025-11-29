import React, { useEffect, useState } from 'react';
import styles from "@/pages/product/product.module.css";
import wishiIcon from "../../assets/img/wish.svg";
import wishiActiveIcon from "../../assets/img/wish_active.svg";
import shareIcon from "../../assets/img/share_icon.svg";
import Map from "../../components/map/Map";
import { useCopyToClipboard } from "@uidotdev/usehooks";
import CommentLayout from '../../components/comment/CommentLayout';
import EventIcon from '../../components/icon/EventIcon';
import { productApi } from '../../api/product/productApi';
import { useQuery } from '@tanstack/react-query';
import { useLocation, useParams } from 'react-router';
import { authStore } from '../../store/authStore';
import { useWish } from '../../hooks/useWish';
import { toast } from 'react-toastify';
import { useComment } from '../../hooks/useComment';
import ImgFallback from '../../components/imgFall/imgFallback';
import CustomAlert from '../../components/alert/CustomAlert';
import { loadingStore } from '../../store/loadingStore';
import Loading from '../../components/Loading';

function Detail() {
    const isAuth = authStore().isAuthenticated();
    const role = authStore().userRole;
    const {productId} = useParams();
    const [mapName, setMapName] = useState('');
    const { toggleWishMutation, isWish } = useWish();
    const {addCommentMutation,updateCommentMutation,deleteCommentMutation} = useComment();
    const CHAIN_MAP = {
        SEV: '7ELEVEN',
        GS25: 'GS25',
        CU: 'CU',
    };

    const isLoading = loadingStore(state => state.loading); // 요청에 대한 로딩 상태
    const setLoading = loadingStore.getState().setLoading;

    const addComment=(content)=>{
        if(!isAuth) return CustomAlert({text: '로그인 후 댓글을 이용해주세요.'});
        addCommentMutation.mutate({crawlId:productId,content});
    }
    const updateComment = (commentId, content)=>{
        updateCommentMutation.mutate({commentId,content});
    }
    const deleteComment = (commentId)=>{
        deleteCommentMutation.mutate(commentId);
    }
    
    
    const {data, isLoading:prdLoading}= useQuery({
        queryKey:['product', productId],
        queryFn: async()=> productApi.getDetail({
            crawlId: productId
        }),
        keepPreviousData: true,
    });

    useEffect(()=>{
        setLoading(prdLoading);
    },[prdLoading,setLoading]);

    const prd = data?.product ?? [];
    const prdComment = data?.comments ?? [];

    const [month, setMonth] = useState(null);

    useEffect(() => {
        if (prd?.crawledAt) {
            const match = prd.crawledAt.match(/-(\d{2})-/);
            setMonth(match ? parseInt(match[1], 10) : null);
        }
        if(prd?.sourceChain){
            const mappedName = CHAIN_MAP[prd.sourceChain] || prd.sourceChain;
            setMapName(mappedName);
        }
    }, [prd]);

    //클립보드
    const [copiedText, copy] = useCopyToClipboard();
    const copyUrl = () => {
        copy(window.location);
        CustomAlert({
            text: '주소가 클립보드에 복사되었습니다'
        })
    }

    const handleWishClick = (e) => {
        e.preventDefault();
        if (!isAuth) {
            toast.warning("로그인 후 찜해주세요!");
            return;
        }
        else if (role === "ROLE_ADMIN") {
            toast.warning("관리자는 찜 기능을 이용할 수 없습니다.");
            return;
        }
        if (toggleWishMutation.isLoading) return; // 중복 클릭 방지
        toggleWishMutation.mutate(prd);
    };

    return (
        <>
        <section className={styles.detail_section}>
            <div className={styles.prd_info}>
                <div className={styles.img_box}>
                    <ImgFallback
                        src={prd.imageUrl}
                        alt={prd.productName}
                    />
                    <button
                        type="button"
                        className={styles.wish_btn}
                        onClick={handleWishClick}
                    >
                        <img src={isWish(prd.crawlId) ? wishiActiveIcon : wishiIcon} alt="" />
                    </button>
                </div>
                <div className={styles.info_box}>
                    <button type="button" className={styles.share_btn} onClick={copyUrl}>
                        <img src={shareIcon} alt="" />
                    </button>
                    <p className={styles.event_text}>{month}월 행사상품</p>
                    <p className={styles.title}>
                        {prd.productName}
                        <EventIcon
                            product={prd}
                        />
                    </p>
                    <p className={styles.price}><strong>{prd.price}</strong> 원</p>
                </div>
            </div>

            <section className={styles.store}>
                <h3>가까운 편의점 보기</h3>
                <div id="map">
                    <Map chainName={mapName} height="400px" showAlert={false}/>
                </div>
            </section>
            
            <CommentLayout 
                comments={prdComment}
                add={addComment}
                update={updateComment}
                del={deleteComment}
            />
            
        </section>
        {isLoading &&
            <Loading />
        }
        
        </>
    );
}

export default Detail;