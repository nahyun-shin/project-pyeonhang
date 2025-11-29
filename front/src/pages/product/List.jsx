import React, { useEffect, useState } from 'react';
import styles from "@/pages/product/product.module.css";
import Item from '../../components/list/Item';
import SearchInput from '../../components/SearchInput';
import { useLocation, useNavigate, useOutletContext } from 'react-router';
import { useQuery } from '@tanstack/react-query';
import { productApi } from '../../api/product/productApi';
import Pagination from '../../components/pagination/Pagination';
import { loadingStore } from '../../store/loadingStore';
import Loading from '../../components/Loading';

function List() {
    const location = useLocation();
    const navigate = useNavigate();
    const queryParams = new URLSearchParams(location.search);
    const { chainId, promoId, categoryId } = useOutletContext();

    const isLoading = loadingStore(state => state.loading); // 요청에 대한 로딩 상태
    const setLoading = loadingStore.getState().setLoading;

    const [totalRows, setTotalRows] = useState(0);

    const currentSort = queryParams.get('sort') ?? 'price,asc';
    const searchQuery = queryParams.get('q') ?? '';
    const currentPage = parseInt(queryParams.get('page') ?? '0', 10);
    
    // API 호출
    const { data, isLoading:prdLoading } = useQuery({
        queryKey: ['product', chainId, promoId, categoryId, currentPage, currentSort,searchQuery],
        queryFn: async () => productApi.getChainListAll({
            sourceChain: chainId,
            promoType: promoId,
            productType: categoryId,
            q : searchQuery,
            page: currentPage,
            sort: currentSort,
        }),
        keepPreviousData: true,
    });
    useEffect(()=>{
        setLoading(prdLoading);
    },[prdLoading]);

    const prdList = data?.items ?? [] ;
    const prdCount = data?.totalElements ?? 0;

    // 페이지 이동 처리
    const movePage = (newPage) => {
        queryParams.set('page', newPage);
        navigate(`${location.pathname}?${queryParams.toString()}`);
    };
    
    useEffect(() => {
        setTotalRows(data?.totalElements || 0);
    }, [data]);

    // 정렬
    const sortChange = (e) => {
        const newSort = e.target.value;
        queryParams.set('sort', newSort);
        queryParams.set('page', 0);
        navigate(`${location.pathname}?${queryParams.toString()}`);
    };
    // 검색
    const handleSearch=(newQuery)=>{
        queryParams.set('q', newQuery);
        queryParams.set('page', 0);
        navigate(`${location.pathname}?${queryParams.toString()}`);
    }



    return (
        <>
            <section className={styles.list_section}>
                <SearchInput onChange={handleSearch} value={searchQuery}/>
                <div className={styles.list_info}>
                    <div className='total'>총 <strong>{prdCount}</strong> 개</div>
                    <select name="" id="" className="form-select" value={currentSort} onChange={sortChange}>
                        <option value="price,asc">가격 낮은 순</option>
                        <option value="price,desc">가격 높은 순</option>
                        <option value="likeCount,desc">인기순</option>
                    </select>
                </div>
                <ul className={styles.prd_list}>
                    {prdList?.map((product) => (
                        <li key={product.crawlId}>
                            <Item key={product.crawlId} product={product}/>
                        </li>
                    ))}
                </ul>
            </section>
            <Pagination page={currentPage} totalRows={totalRows} pagePerRows='20' movePage={movePage} />
            {isLoading &&
                <Loading />
            }
        </>
    );
}

export default List;
