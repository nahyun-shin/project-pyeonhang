import React, { useState } from 'react';
import styles from "@/pages/mypage/mypage.module.css";
import ShowModal from '../../components/modal/ShowModal';
import { useOutletContext } from 'react-router';
import { formatDate } from '../../hooks/utils';
import { loadingStore } from '../../store/loadingStore';
import Loading from '../../components/Loading';
import Pagination from '../../components/pagination/Pagination';

function Coupon(props) {
    const {movePage, currentPage, couponList}=useOutletContext();
    const [show, setShow] = useState(false);
    const [showCoupon, setShowCoupon] = useState('');

    const isLoading = loadingStore(state => state.loading); // 요청에 대한 로딩 상태

    const pagedList = couponList.slice(currentPage * 9, (currentPage + 1) * 9);

    const handleClose = () => {
        setShow(false);
    }
    const openCouponLayer = (e) => {
        const img = e.currentTarget.dataset.img;
        setShowCoupon(img);
        setShow(true);
    }

    return (
        <>
            <div className={styles.coupon_cont}>
                <h3>보유쿠폰</h3>
                <ul>
                    {couponList&&couponList.length>0?
                        (pagedList?.map((item)=>
                            (
                            <li key={item.couponId} onClick={openCouponLayer} data-img={item.imgUrl}>
                                <span>{formatDate(item.acquiredAt)} 발행</span>
                                <p>{item.couponName}</p>
                            </li>
                            )
                        )):
                        (<p className={styles.none_list}>보유한 쿠폰이 없습니다.</p>)
                    }
                </ul>
            </div>

            <ShowModal show={show} handleClose={handleClose} title="보유 쿠폰" 
            className={styles.coupon_modal}
            closeBtnName='닫기'>
                <div className={styles.img_box}>
                    <img src={showCoupon} alt="쿠폰 이미지" />
                </div>
                <div className={styles.notice_box}>
                    <p>※ 포인트 교환으로 받으신 상품권은 취소가 불가합니다.</p>
                    <p>※ 오프라인 전용 쿠폰입니다.</p>
                    <p>※ 교환 후 마이페이지 보유 쿠폰 메뉴에서 확인해주세요.</p>
                </div>
            </ShowModal>  
            <Pagination page={currentPage} totalRows={couponList.length} pagePerRows={10} movePage={movePage} />  
            {isLoading &&
                <Loading />
            }        
        </>
    );
}

export default Coupon;