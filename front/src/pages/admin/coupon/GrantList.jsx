import React, { useEffect, useMemo, useState } from 'react';
import Table from '../../../components/table/Table';
import { Link, useLocation, useNavigate } from 'react-router';
import { couponAdminApi } from '../../../api/coupon/couponAdminApi';
import { useAdmin } from '../../../hooks/useAdmin';
import { useQuery } from '@tanstack/react-query';
import { formatDate } from '../../../hooks/utils';
import Loading from '../../../components/Loading';
import { loadingStore } from '../../../store/loadingStore';
import Pagination from '../../../components/pagination/Pagination';


const colWidth = ['60px', '', '300px', '150px'];
const headers = ['NO', '요청 정보', '유저 ID', '요청 날짜'];

function GrantList(props) {
    const navigate = useNavigate();
    const location = useLocation();
    const isLoading = loadingStore(state => state.loading); // 요청에 대한 로딩 상태
    const setLoading = loadingStore.getState().setLoading;
    
    const queryParams = new URLSearchParams(location.search);
    const currentPage = parseInt(queryParams.get('page') ?? '0', 10);
    // const currentSort = queryParams.get('sort') ?? 'acquiredAt,desc';
    const [totalRows, setTotalRows] = useState(0);

    const {data,isLoading:couponLoading}= useQuery({
        queryKey : ['coupon',currentPage],
        queryFn: async()=>couponAdminApi.requestList({
            page: currentPage,
            // sort: currentSort
        }),
        keepPreviousData: true,
    })

     // 페이지 이동 처리
    const movePage = (newPage) => {
        queryParams.set('page', newPage);
        navigate(`${location.pathname}?${queryParams.toString()}`);
    };

     // 전역 로딩 상태 동기화
    useEffect(() => {
        setLoading(couponLoading);
    }, [couponLoading, setLoading]);

    //데이터 세팅
    const couponList = data?.items ?? [];

    useEffect(()=>{
        setTotalRows(data?.count);
    },[data])
    
    //사용자의 쿠폰요청 리스트
    const columns = useMemo(() => {
        if (!couponList) return [];
        return couponList.map((item, index) => ({
            couponId: index + 1,
            couponName: item.couponName,
            userId: item.userId,
            date: formatDate(item.acquiredAt)
        }));
    }, [couponList])

    return (
        <>
            <section style={{'paddingTop':"70px"}}>
                <div className="btn_box text-end mb-3">
                    <Link to="/admin/coupon/regist" className='btn btn-dark'>쿠폰 리스트</Link>
                </div>
                <Table 
                    headers={headers} 
                    data={couponList} 
                    colWidth={colWidth}
                    columns={columns}
                    />
            </section>
            <Pagination page={currentPage} totalRows={totalRows} pagePerRows={10} movePage={movePage} />
            {isLoading &&
                <Loading />
            }
        </>
    );
}

export default GrantList;