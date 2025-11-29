import React, { useEffect, useState } from 'react';
import { Col, Container, Row } from 'react-bootstrap';
import styles from "@/pages/mypage/mypage.module.css";
import { Link, NavLink, Outlet, useLocation, useNavigate } from 'react-router';
import { useMypage } from '../../hooks/useMypage';
import { authStore } from '../../store/authStore';
import { useQueries } from '@tanstack/react-query';
import { wishApi } from '../../api/mypage/wishApi';
import { pointApi } from '../../api/mypage/pointApi';
import { couponApi } from '../../api/mypage/couponApi';
import { useWish } from '../../hooks/useWish';
import Loading from '../Loading';
import { loadingStore } from '../../store/loadingStore';


function Layout() {
    const { userName } = authStore();
    const isAuth = authStore().isAuthenticated(); 
    const location = useLocation();
    const navigate = useNavigate();
    
    const queryParams = new URLSearchParams(location.search);
    const currentPage = parseInt(queryParams.get('page') ?? '0', 10);
    
    const { deleteUserMutation } = useMypage();

    const isLoading = loadingStore(state => state.loading); // 요청에 대한 로딩 상태
    const setLoading = loadingStore.getState().setLoading;

    // 전역 상태 연동 총 찜 개수
    const { wishCount } = useWish();

    // 페이지 이동 처리
    const movePage = (newPage) => {
        const params = new URLSearchParams(location.search);
        params.set('page', newPage);
        navigate(`${location.pathname}?${params.toString()}`);
    };

     // useQueries로 여러 API 동시 호출
    const results = useQueries({
        queries: [
            {
                queryKey: ['point'],
                queryFn: async () => {
                    const res = await pointApi.list();
                    return res;
                },
                enabled: isAuth,
            },
            {
                queryKey: ['coupon'],
                queryFn: async () => {
                    const res = await couponApi.list();
                    return res;
                },
                enabled: isAuth,
            },
        ],
    });
    
    // 결과값을 state에 반영
    const [pointRes, couponRes] = results;

    const isPointLoading = pointRes?.isLoading;
    const isCouponLoading = couponRes?.isLoading;

    useEffect(()=>{
        if(isPointLoading ||isCouponLoading){
            setLoading(true);
        }else{
            setLoading(false);
        }
    },[isPointLoading,isCouponLoading,setLoading]);

    const pointList = pointRes.data?.items ?? [];
    const totalPoint = pointRes.data?.balance ?? 0;

    const couponList = couponRes.data?.items ?? [];
    const couponCount = couponRes.data?.count ?? 0;

    const deleteUser = async () => {
        await deleteUserMutation.mutateAsync();
    };
    
    return (
        <>
        <Container className={styles.my_cont}>
            <h2 className={styles['page_title']}>마이페이지</h2>
            <div className={styles.top_box}>
                <div className={styles.text_box}>
                    <strong>{userName}</strong> 님<br />
                    안녕하세요
                </div>
                <ul className={styles.card_box}>
                    <li>
                        <Link to="/mypage/wish">
                            <span>찜한상품</span>
                            <p><b>{wishCount}</b> 개</p>
                        </Link>
                    </li>
                    <li>
                        <Link to="/mypage/point">
                            <span>포인트</span>
                            <p><b>{totalPoint}</b> P</p>
                        </Link>
                    </li>
                    <li>
                        <Link to="/mypage/coupon">
                            <span>쿠폰</span>
                            <p><b>{couponCount}</b> 장</p>
                        </Link>
                    </li>
                </ul>
            </div>

            <Row className={styles.contents}>
                <Col xs={2}>
                    <ul className={styles.sub_category_list}>
                        <li>
                            <NavLink to="/mypage/wish" className={({isActive}) => isActive? styles.active:""}
                            >찜목록</NavLink>
                        </li>
                        <li>
                            <NavLink to="/mypage/point" className={({isActive}) => isActive? styles.active:""}>포인트 내역</NavLink>                    
                        </li>
                        <li>
                            <NavLink to="/mypage/coupon" className={({isActive}) => isActive? styles.active:""}>보유 쿠폰</NavLink>                    
                        </li>
                        <li>
                            <NavLink to="/mypage/check" className={({isActive}) => isActive? styles.active:""}>출석 체크 현황</NavLink>
                        </li>
                        <li>
                            <NavLink to="/mypage/profile" className={({isActive}) => isActive? styles.active:""}>내 정보 수정</NavLink>
                        </li>
                        <li>
                            <button onClick={deleteUser}>회원탈퇴</button>
                        </li>
                    </ul>
                </Col>
                <Col xs={10} className={styles.right_contents}>
                    <Outlet context={{movePage, currentPage,pointList,totalPoint,couponList}}/>
                </Col>
            </Row>
        </Container>
        {isLoading &&
            <Loading />
        }
        </>
    );
}

export default Layout;