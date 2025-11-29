import React, { useEffect, useState } from 'react';
import ShowModal from '@/components/modal/ShowModal';
import InputForm from '../../../components/InputForm';
import * as yup from "yup";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import { Link } from 'react-router';
import Table from '../../../components/table/Table';
import { useAdmin } from '../../../hooks/useAdmin';
import { loadingStore } from '../../../store/loadingStore';
import Loading from '../../../components/Loading';

const colWidth = ['60px', '70%'];
const headers = ['NO' ,'쿠폰 이름', '관리'];

function List(props) {

    const [showModal, setShowModal] = useState(false);
    const [couponList, setCouponList] = useState([]);
    const [columns, setColumns] = useState([]);
    const [currentCoupon, setCurrentCoupon] = useState(null);
    const [checkedList, setCheckedList] = useState([]);

    const isLoading = loadingStore(state => state.loading); // 요청에 대한 로딩 상태

    const { getCouponListMutation, createCouponMutation, updateCouponMutation, deleteCouponMutation } = useAdmin();

    const schema = yup.object().shape({
        couponName: yup.string().required("쿠폰 이름을 입력하십시오"),
        requiredPoint: yup.string().required("차감 포인트를 입력하십시오"),
        file: yup.mixed().when("imgUrl", (imgUrl, schema) => {
          return imgUrl
            ? schema
            : schema.required("이미지 파일을 업로드 해주세요.");
        }),
        // file: yup.mixed().required("파일을 선택해주세요")
        //             .test(
        //                 "fileSelected",
        //                 "파일을 선택해주세요",
        //                 value => value && value.length > 0
        //             )
    });
    const {
        register,
        handleSubmit,
        formState: { errors },
        reset,
        setValue,
        getValues,
    } = useForm({
        resolver: yupResolver(schema),
    });

    // 쿠폰 리스트 불러오기
    const fetchList = async () => {
        const result = await getCouponListMutation.mutateAsync();
        const data = result.data.response.content;
        setCouponList(data);
        
        const columns = data.map((el) => {
            const {couponId, couponName, ...rest} = el;
            return {id: couponId, couponName};
        });
        setColumns(columns);
    }

    const openCouponModal = (type, currentId) => {
        // 쿠폰 수정 시 현재 쿠폰정보 가져오기
        if(type == 'update') {
            setShowModal(true)
            setCurrentCoupon(couponList.filter((coupon) => currentId == coupon.id)[0])
            return;    
        }
        setCurrentCoupon(null);
        setShowModal(true);
    }

    const closeModal = () => {
        setShowModal(false);
    }

    // 쿠폰 등록, 수정
    const handleCouponSubmit = handleSubmit(async (formData)=>{
        if(currentCoupon){
            formData.couponId = currentCoupon.couponId;
            formData.cloudinaryId = currentCoupon.cloudinaryId;
            await updateCouponMutation.mutateAsync(formData);
            
        }else{
            await createCouponMutation.mutateAsync(formData);
        }
       
        fetchList(); // 쿠폰 리스트 불러오기
        reset(); // 입력 초기화
        setShowModal(false);
    });

    // 쿠폰 삭제
    const handleDelete = async() => {
        console.log(checkedList);
        await deleteCouponMutation.mutateAsync(checkedList);
        fetchList();
    }

    // 쿠폰 이미지 미리보기
    const handleFileChange = (e) => {
        const file = e.target.files[0];
        if (file) {
            // 이미지 미리보기 URL 생성
            const newUrl = URL.createObjectURL(file);
        }
    };


    // 쿠폰 리스트 가져오기
    useEffect(() => {
        fetchList();
    }, [])


    console.log(checkedList)

    // 현재 쿠폰 정보 가져오기
    useEffect(() => {
        if(currentCoupon) {
            reset({
                couponName: currentCoupon.couponName,
                description: currentCoupon.description,
                requiredPoint: currentCoupon.requiredPoint,
            });
        } else {
            reset({
                couponName: '',
                description: '',
                requiredPoint: '',
            });
        }
    }, [currentCoupon, reset]);

    return (
        <>
            <div className='w-50 mx-auto mt-5'>
                <div className="btn_box text-end mb-3">
                    <button type="button" className='btn btn-outline-dark px-3 me-2' onClick={openCouponModal}>등록</button>
                    <button type="button" className='btn btn-outline-danger px-3' onClick={handleDelete}>삭제</button>
                    <Link to="/admin/coupon/grant" className='btn btn-dark ms-2'>쿠폰 발급 현황</Link>
                </div>

                <Table 
                    colWidth={colWidth} 
                    data={couponList} 
                    columns={columns}
                    headers={headers} 
                    isCheckbox={true} 
                    setCheckedList={setCheckedList} 
                    clickColumnBtn={openCouponModal} 
                />
            </div>
            <ShowModal show={showModal} handleClose={closeModal} 
                    title={currentCoupon ? "쿠폰 수정" : "쿠폰 등록"} 
                    handleEvent={handleCouponSubmit}
                    eventBtnName={currentCoupon ? "수정" : "등록"}
                    closeBtnName='닫기'>
                <form action="" id="" name="">
                    <InputForm 
                        register={register} 
                        label={"쿠폰명"} 
                        placeholder={"쿠폰명을 입력해주세요"}
                        name={"couponName"} 
                        error={errors}

                    />
                    <InputForm 
                        register={register} 
                        label={"쿠폰 설명"} 
                        placeholder={"쿠폰 설명을 입력해주세요"} 
                        name={"description"} 
                        error={errors}
                        className='mt-4' 
                    />
                    <InputForm 
                        register={register} 
                        label={"쿠폰 금액"} 
                        placeholder={"쿠폰 발급 시 차감 될 포인트를 입력해주세요"} 
                        name={"requiredPoint"} 
                        error={errors}
                        className='mt-4' 
                    />
                    <label className='file_box' htmlFor='file' style={{
                        display:'flex', 
                        alignItems:'center',
                        justifyContent: 'center',
                        background:'#f7f7f7', 
                        height: '100px',
                        cursor: 'pointer'
                        }}>
                        {currentCoupon?.imgUrl ? <img src={currentCoupon.imgUrl} /> : '+'}
                    </label>
                    <InputForm 
                        register={register} 
                        type={'file'} 
                        id={'file'}
                        label={"쿠폰 이미지"} 
                        name={"file"} 
                        error={errors}
                        className='mt-4' 
                    />
                </form>
            </ShowModal>
            {couponList?.length == 0 &&
                <div>
                    등록한 쿠폰이 없습니다.
                </div>
            }
            {isLoading &&
                <Loading />
            }
        </>
    );
}

export default List;