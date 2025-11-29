import React, { useEffect, useState } from 'react';
import styles from "@/pages/mypage/mypage.module.css";
import ShowModal from '../../components/modal/ShowModal';
import { useQuery } from '@tanstack/react-query';
import { pointApi } from '../../api/mypage/pointApi';
import { useOutletContext } from 'react-router';
import Pagination from '../../components/pagination/Pagination';
import { couponAdminApi } from '../../api/coupon/couponAdminApi';
import { usePoint } from '../../hooks/usePoint';
import { formatDate } from '../../hooks/utils';
import CustomAlert from '../../components/alert/CustomAlert';
import { loadingStore } from '../../store/loadingStore';
import Loading from '../../components/Loading';

function Point(props) {
    const [show, setShow] = useState(false);
    const { movePage, currentPage, pointList, totalPoint } = useOutletContext();
    const [couponId, setCouponId]=useState(0);
    const [couponPoint, setCouponPoint]=useState(0);

    const isLoading = loadingStore(state => state.loading); // 요청에 대한 로딩 상태

    const {changePoint}=usePoint();

    const pagedList = pointList.slice(currentPage * 10, (currentPage + 1) * 10);
    const setLoading = loadingStore.getState().setLoading;

    //관리자가 등록한 쿠폰 리스트
    const {data:couponData, isLoading:adminCouponLoading} = useQuery({
        queryKey:['adminCouponList'],
        queryFn:async()=>couponAdminApi.list(),
    });
    //로딩 동기화
    useEffect(()=>{
        setLoading(adminCouponLoading);
    },[adminCouponLoading,setLoading]);

    const admincouponList = couponData?.data.response.content ?? [];

    const handleChange=(e)=>{
        setCouponId(Number(e.target.id));
        setCouponPoint(Number(e.target.value));
    }
    
    const changePointHandle = () => {

        if(totalPoint<couponPoint){
            CustomAlert({
                text: "보유한 포인트를 확인해주세요.",
            });
            return;
        }

        changePoint.mutate(couponId);
        setShow(false);
    }
    const handleClose=()=>{
        setShow(false);
    }
    const openCouponLayer = () => {
        setShow(true);
    }

    return (
        <>
        <div className={styles.point_cont}>
            <h3>
                포인트 내역
                <button type="button" 
                className={styles.coupon_btn} 
                onClick={openCouponLayer}>쿠폰 교환</button>
            </h3>

            <table>
                <thead>
                    <tr>
                        <th>날짜</th>
                        <th>포인트 정보</th>
                        <th>내역</th>
                    </tr>
                </thead>
                <tbody>
                    {pagedList?.map((item)=>(
                        <tr key={item.id}>
                            <td>{formatDate(item.createDate)}</td>
                            <td>{item.reason}</td>
                            <td className={item.amount > 0 ? styles.plus : styles.minus}>{item.amount}</td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>

        <ShowModal 
        show={show} 
        handleEvent={changePointHandle}
        handleClose={handleClose}
        title="쿠폰 교환"
        className={styles.coupon_modal}
        eventBtnName='교환'
        closeBtnName='닫기'
        >
            <div className={styles.notice_box}>
                <p>※ 포인트 교환으로 받으신 상품권은 취소가 불가합니다.</p>
                <p>※ 오프라인 전용 쿠폰입니다.</p>
                <p>※ 교환 후 마이페이지 보유 쿠폰 메뉴에서 확인해주세요.</p>
            </div>
            <div className={styles.coupon_list}>
                {admincouponList?.map((coupon)=>(
                    <div key={coupon.couponId} className={styles.coupon_box}>
                        <input type="radio" 
                            name="coupon"
                            id={coupon.couponId} 
                            className='form-check' 
                            value={coupon.requiredPoint} 
                            onChange={handleChange}/>
                        <label htmlFor={coupon.couponId}>
                            {coupon.couponName}
                        </label>
                    </div>
                ))}
            </div>
        </ShowModal>
        <Pagination page={currentPage} totalRows={pointList.length} pagePerRows={10} movePage={movePage} />
        {isLoading &&
            <Loading />
        }
        </>
    );
}

export default Point;