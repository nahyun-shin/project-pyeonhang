import React, { useEffect, useState } from 'react';
import styles from '@/pages/admin/product/adminProduct.module.css';
import { Link, useLocation, useNavigate, useParams } from 'react-router';
import errorImg from '../../../assets/img/errorImg.png';
import * as yup from "yup";
import { yupResolver } from '@hookform/resolvers/yup';
import { useForm } from 'react-hook-form';
import { useQuery } from '@tanstack/react-query';
import { productApi } from '../../../api/product/productApi';
import { useProduct } from '../../../hooks/useProduct';
import { loadingStore } from '../../../store/loadingStore';
import Loading from '../../../components/Loading';

const schema = yup.object().shape({
    productName: yup.string().required("상품명을 입력하십시오"),
    price: yup.string().required("가격을 입력하십시오"),
    sourceChain: yup.string().required(),
    productType: yup.string().required(),
    promoType: yup.string().nullable(),
    imageUrl: yup.string().url("올바른 URL 형식이 아닙니다.").nullable(),
});

function AdminProductUpdate() {
    const navigate = useNavigate();
    const location = useLocation();
    const { productId } = useParams();
    const { prdUpdateMutation } = useProduct(productId);
    

    const [viewImg, setViewImg] = useState('');
    const [inputURL, setInputURL] = useState('');
    const [chain, setChain] = useState('');

    const { register, handleSubmit, formState: { errors }, reset, setValue, watch } = useForm({
        resolver: yupResolver(schema),
    });

    const isLoading = loadingStore(state => state.loading); // 요청에 대한 로딩 상태
    const setLoading = loadingStore.getState().setLoading;

    const { data , isLoading : prdLoading} = useQuery({
        queryKey: ['product', productId],
        queryFn: async() => productApi.getDetail({ crawlId: productId }),
        keepPreviousData: true,
    });
    //리스트 불러올 때 전역 로딩 상태 동기화
    useEffect(()=>{
        setLoading(prdLoading);
    },[prdLoading,setLoading]);

    useEffect(() => {
        if(data) {
            reset({
                productName : data.product.productName,
                price : data.product.price,
                sourceChain : data.product.sourceChain,
                productType : data.product.productType,
                promoType : data.product.promoType,
                imageUrl : data.product.imageUrl,
            });
            setViewImg(data.product.imageUrl); // 초기 이미지 설정
            setInputURL(data.product.imageUrl); // input에도 초기값 넣기
            setChain(data.product.sourceChain);
        }
    }, [data, reset]);

    const handleChange = (e) => setInputURL(e.target.value);

    const imgSubmit = () => {
        setValue("imageUrl", inputURL);
        setViewImg(inputURL);
    };

    const handleKeyPress = (e) => {
        if (e.key === 'Enter') {
            e.preventDefault();
            imgSubmit();
        }
    };

    const onSubmit = (data) => {
        prdUpdateMutation.mutate(data);
        const from = location.state?.from;
        navigate(from ? from.pathname + from.search : '/admin/product');
    }

    const watchedPromoType = watch("promoType");

    // 체인에 따라 선택 가능한 promoType 옵션
    const getPromoOptions = () => {
        const options = [
            { value: "ONE_PLUS_ONE", label: "1 + 1" },
            { value: "TWO_PLUS_ONE", label: "2 + 1" }
        ];
        if (chain === 'GS25' || chain === 'SEV') options.push({ value: "GIFT", label: "덤 증정" });
        if (chain === 'SEV') options.push({ value: "NONE", label: "할인행사" });
        return options;
    }

    return (
        <>
        <form onSubmit={handleSubmit(onSubmit)}>
            <div className={styles.content_bg}>
                <div className={styles.view_img_wrap}>
                    <img
                        src={viewImg || errorImg}
                        alt={watch("productName")}
                        onError={(e) => e.currentTarget.src = errorImg}
                    />
                </div>

                <div className={styles.r_content}>
                    <label htmlFor="store">편의점</label>
                    <select
                        id="store"
                        {...register("sourceChain")}
                        value={chain}
                        className="form-select"
                        onChange={(e) => {
                            setChain(e.target.value);
                            setValue("sourceChain", e.target.value);
                        }}
                    >
                        <option value="CU">CU</option>
                        <option value="SEV">7ELEVEN</option>
                        <option value="GS25">GS25</option>
                    </select>

                    <label htmlFor="category">카테고리</label>
                    <select
                        id="category"
                        {...register("productType")}
                        className="form-select"
                    >
                        <option value="SNACK">과자</option>
                        <option value="DRINK">음료수</option>
                        <option value="FOOD">식품</option>
                        <option value="LIFE">생활용품</option>
                    </select>

                    <label htmlFor="productName">상품명</label>
                    <input
                        type="text"
                        id="productName"
                        className='form-control'
                        {...register("productName")}
                    />

                    <label htmlFor="price">가격</label>
                    <input
                        type="text"
                        id="price"
                        className='form-control'
                        {...register("price")}
                    />

                    <label htmlFor="imgURL">이미지 URL</label>
                    <div className={styles.btn_input}>
                        <input
                            type="text"
                            id="imgURL"
                            placeholder="이미지 URL 입력"
                            onChange={handleChange}
                            onKeyDown={handleKeyPress}
                            value={inputURL}
                            className={`${styles.short_input} form-control`}
                        />
                        <button type='button' onClick={imgSubmit}>확인</button>
                    </div>

                    <label htmlFor="promoType">행사정보</label>
                    <select
                        id="promoType"
                        {...register("promoType")}
                        className="form-select"
                        value={watchedPromoType || ""}
                        onChange={(e) => setValue("promoType", e.target.value)}
                    >
                        
                        {getPromoOptions().map(opt => (
                            <option key={opt.value} value={opt.value}>{opt.label}</option>
                        ))}
                    </select>
                </div>
            </div>

            <div className='short_btn_bg'>
                <button type='submit' className='min_btn_b'>수정</button>
                <Link 
                    to={location.state?.from ? location.state.from.pathname + location.state.from.search : '/admin/product'}
                    className='min_btn_w'
                >
                    목록
                </Link>
            </div>
        </form>
        {isLoading &&
            <Loading />
        }
        </>
    );
}

export default AdminProductUpdate;
