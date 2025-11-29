import React, { useState } from "react";
import { Link } from "react-router";
import styles from '@/pages/login/login.module.css';
import InputForm from "../../components/InputForm";
import * as yup from "yup";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import { useLogin } from "../../hooks/useLogin";
import { loadingStore } from "../../store/loadingStore";
import Loading from "../../components/Loading";

const findIdFields = [
    { label: "이름", name: "userName", type: "text", placeholder: "이름을 입력하세요" },
    { label: "이메일", name: "email", type: "text", placeholder: "이메일을 입력하세요" },
];


function FindId(props) {
    const [checkId, setCheckId] = useState(null);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [closeModal, setCloseModal] = useState(false);
    
    const { findIdMutation } = useLogin();
    
    

    const schema = yup.object().shape({
        userName: yup.string().required("이름을 입력하십시오"),
        email: yup.string().email("올바른 이메일 형식이 아닙니다.").required("이메일을 입력하십시오."),
    });
    const {
        register,
        handleSubmit,
        formState: { errors },
        reset,
    } = useForm({
        resolver: yupResolver(schema),
    });

    const isLoading = loadingStore(state => state.loading); // 요청에 대한 로딩 상태
    
    const onSubmit = async (data) => {
        console.log("폼 데이터:", data);
        const result = await findIdMutation.mutateAsync(data);
        setCheckId(result.data);
        reset();
    };

    return (
        <>
        
            {!checkId && (
                <form className={styles.user_loginp_wrap} onSubmit={handleSubmit(onSubmit)}>
                    {findIdFields.map((field) => (
                        <InputForm
                        key={field.name}
                        {...field}
                        register={register}
                        error={errors[field.name]}
                        />
                    ))}

                    <div className='long_btn_bg'>
                        <button type="submit" className="btn_50_b">아이디찾기</button>
                    </div>
                </form>
            )}
            {checkId &&(
                <div className={styles.user_loginp_wrap}>
                    <p className={styles.result_id_txt}>
                        회원님의 아이디는 {checkId} 입니다.
                    </p>
                    <div className='long_btn_bg'>
                        <Link to={"/login"} className='btn_50_b'>로그인</Link>
                        <Link to={"/login/findPw"} className='btn_50_w'>비밀번호 찾기</Link>
                    </div>
                </div>
            )}
        
        {/* 모달 */}
        {isModalOpen && (
            <div className="modal" onClick={closeModal}>
                <div className="modal-content" onClick={(e) => e.stopPropagation()}>
                    <div className="modal-content-list">
                    <p>
                        조회된 정보가 없습니다.
                        <br />
                        다시 입력해 주세요.
                    </p>
                    
                    <button
                        type='submit'
                        onClick={closeModal}
                        className='modal-log-btn'>
                    닫기
                    </button>
                    </div>
                </div>
            </div>
        )} 
        {isLoading &&
            <Loading />
        }
        </>
    );
}

export default FindId;
