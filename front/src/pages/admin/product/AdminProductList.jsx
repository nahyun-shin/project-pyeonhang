import React, { useCallback, useEffect, useState } from 'react';
import SearchInput from '../../../components/SearchInput';
import styles from '@/pages/admin/product/adminProduct.module.css';
import EventIcon from '../../../components/icon/EventIcon';
import StoreIcon from '../../../components/icon/StoreIcon';
import ListBtnLayout from '../../../components/btn/ListBtnLayout';
import { mockProducts } from '../../../hooks/mockProducts';
import { useQuery } from '@tanstack/react-query';
import { productApi } from '../../../api/product/productApi';
import { useLocation, useNavigate, useParams } from 'react-router';
import Pagination from '../../../components/pagination/Pagination';
import { useProduct } from '../../../hooks/useProduct';
import CustomAlert from '../../../components/alert/CustomAlert';
import { loadingStore } from '../../../store/loadingStore';
import Loading from '../../../components/Loading';
import ImgFallback from '../../../components/imgFall/imgFallback';

function AdminProductList(props) {
    const navigate = useNavigate();
    const location = useLocation();
    const { prdDeleteMutation } = useProduct();
    const queryParams = new URLSearchParams(location.search);
    const { sourceChain, promoType, productType } = useParams();
    //sort필터사용시 활성
    const [currentSort, setCurrentSort] = useState(queryParams.get('sort') ?? 'price,asc');
    //페이징
    const [totalRows, setTotalRows] = useState(0);

    // 이전 페이지에서 돌아왔을 경우 이전 param으로 그렇지않으면 초기화
    const getParam = (key, defaultValue) => {
        if (location.state?.from) {
            const params = new URLSearchParams(location.state.from.search);
            return params.get(key) ?? defaultValue;
        }
        return queryParams.get(key) ?? defaultValue;
    };
    
    const [currentPage, setCurrentPage] = useState(() => parseInt(getParam('page', '0'), 10));
    const [chainId, setChainId] = useState(() => getParam('sourceChain', sourceChain?.toUpperCase() || 'ALL').toUpperCase());
    const [promoId, setPromoId] = useState(() => getParam('promoType', promoType?.toUpperCase() || 'ALL').toUpperCase());
    const [categoryId, setCategoryId] = useState(() => getParam('productType', productType?.toUpperCase() || 'ALL').toUpperCase());
    const [searchQuery, setSearchQuery] = useState(() => getParam('q', ''));
    
    

    // 필터 변경 시 URL 업데이트
    const updateUrl = useCallback((newParams) => {
        Object.entries(newParams).forEach(([key, value]) => {
            if (value != null) queryParams.set(key, value);
            else queryParams.delete(key);
        });
        navigate(`${location.pathname}?${queryParams.toString()}`);
    }, [location.pathname, location.search, navigate]);

    // 셀렉트박스 핸들러
    const handleFilterChange = (type, value) => {
        switch(type) {
        case 'chain':
            setChainId(value || 'ALL');
            updateUrl({ sourceChain: value, page: 0 });
            setCurrentPage(0);
            break;
        case 'promo':
            setPromoId(value || 'ALL');
            updateUrl({ promoType: value, page: 0 });
            setCurrentPage(0);
            break;
        case 'category':
            setCategoryId(value || 'ALL');
            updateUrl({ productType: value, page: 0 });
            setCurrentPage(0);
            break;
        default: break;
        }
    };


    // 페이지 이동 처리
    const movePage = (newPage) => {
        setCurrentPage(newPage);
        updateUrl({ page: newPage });
    };
    // 검색
    const handleSearch=(newQuery)=>{
        setSearchQuery(newQuery);
        updateUrl({ q: newQuery, page: 0 });
    }
    // 삭제
    const handleDelete=async(productId)=>{
        const isConfirm = await CustomAlert({
            title: "상품 삭제",
            width:"500px",
            showCancelButton:true,
            text:"정말 삭제하시겠습니까?"
        });
        if(!isConfirm)return;
        prdDeleteMutation.mutate(productId);
    }

    const isLoading = loadingStore(state => state.loading); // 요청에 대한 로딩 상태
    const setLoading = loadingStore.getState().setLoading;
    

    // 데이터 리스트 불러오기
    const { data, isLoading : prdLoading} = useQuery({
        queryKey: ['product', chainId, promoId, categoryId, currentPage,searchQuery],
        queryFn: async () => productApi.getChainListAll({
            sourceChain:chainId,
            promoType:promoId,
            productType:categoryId,
            q : searchQuery,
            page: currentPage,
        }),
        keepPreviousData: true,
    });
    //리스트 불러올 때 전역 로딩 상태 동기화
    useEffect(()=>{
        setLoading(prdLoading);
    },[prdLoading,setLoading]);
    //데이터 셋팅
    const prdList = data?.items ?? [];
    //페이징처리 위해 data 총 length
    useEffect(()=>{
        if(data){
            setTotalRows(data.totalElements || 0);
        }
    },[data]);
    //  월 추출 함수 (간단한 방법)
    const getMonth = (dateString) => {
        if (!dateString) return '';
        return dateString.split('-')[1];
    };

    return (
        <>
            <div className='base_search_bg'>
                <select value={chainId === 'ALL' ? '' : chainId} onChange={(e) => handleFilterChange('chain', e.target.value)} className="form-select">
                    <option value="ALL">편의점 별</option>
                    <option value="CU">CU</option>
                    <option value="SEV">7ELEVEN</option>
                    <option value="GS25">GS25</option>
                </select>
                <select value={promoId === 'ALL' ? '' : promoId} onChange={(e) => handleFilterChange('promo', e.target.value)} className="form-select">
                    <option value="ALL">행사 별</option>
                    <option value="ONE_PLUS_ONE"> 1 + 1 </option>
                    <option value="TWO_PLUS_ONE"> 2 + 1 </option>
                    <option value="GIFT">덤 증정</option>
                    <option value="NONE">할인 행사</option>
                </select>
                <select value={categoryId === 'ALL' ? '' : categoryId} onChange={(e) => handleFilterChange('category', e.target.value)} className="form-select">
                    <option value="ALL">카테고리 별</option>
                    <option value="SNACK">과자</option>
                    <option value="DRINK">음료</option>
                    <option value="FOOD">식품</option>
                    <option value="LIFE">생활용품</option>
                </select>
                <SearchInput onChange={handleSearch} value={searchQuery}/>
            </div>

            <div className={`${styles.admin_total}`}>
                <div className='total'>
                    총 <strong>{totalRows}</strong> 개
                </div>
            </div>
            {prdList?.map((product,index)=>(
                <ListBtnLayout
                    key={index}
                    topBtn={{ 
                        type: 'link',
                        to:`/admin/product/update/${product.crawlId}`,
                        state:{ from: location },
                        name: '수정',
                    }}
                    bottomBtn={{ 
                        type: 'button', 
                        name: '삭제',
                        onClick: ()=>handleDelete(product.crawlId)
                    }}
                >
                    <div className={styles.item_box}>
                        <ImgFallback
                            src={product.imageUrl}
                            alt={product.productName}
                        />
                        <StoreIcon 
                            product={product.sourceChain}
                            cssPosition="absolute"
                            top='10px'
                            right='10px'    
                        />
                    </div>
                    <div className={styles.left_info_box}>
                        <div className={styles.icon_wrap}>
                            <EventIcon product={product} />
                        </div>
                        <p className={styles.title}>{product.productName}</p>
                        <p className={styles.evtMonth}>{getMonth(product.crawledAt)}월행사상품</p>
                    </div>
                    <span className={styles.price}>{product.price.toLocaleString()}원</span>
                </ListBtnLayout>
            ))}
            <Pagination page={currentPage} totalRows={totalRows} pagePerRows={20} movePage={movePage} />
            {isLoading &&
                <Loading />
            }
        </>
    );
}

export default AdminProductList;