import { yupResolver } from "@hookform/resolvers/yup";
import React, { useState } from "react";
import { useForm } from "react-hook-form";
import { Link, useNavigate } from "react-router";
import * as yup from "yup";
import InputForm from "../../components/InputForm";
import ShowModal from "../../components/modal/ShowModal";
import styles from '@/pages/login/login.module.css';
import { useLogin } from "../../hooks/useLogin";
import Loading from "../../components/Loading";
import { loadingStore } from "../../store/loadingStore";


const findPwFields = [
    { label: "아이디", name: "userId", type: "text", placeholder: "아이디를 입력하세요" },
    { label: "이메일", name: "email", type: "text", placeholder: "이메일을 입력하세요" },
];
const chgPwFields = [
  { label: "새 비밀번호", name: "newPassword", type: "password", placeholder: "비밀번호를 입력하세요" },
  { label: "새 비밀번호 확인", name: "confirmNewPassword", type: "password", placeholder: "비밀번호를 입력하세요" },
];

function FindPw(props) {
    const [checkPw, setCheckPw] = useState(false);
    const [checkCode, setCheckCode] = useState(false);
    const navigate = useNavigate();
    
    const [show, setShow] = useState(false);
    const isLoading = loadingStore(state => state.loading); // 요청에 대한 로딩 상태
    const { findPwMutation, confirmEmailCodeMutation, newPwMutation } = useLogin();

    const handleClose = () => {
        setShow(false)
        navigate('/login')
    };

    const findSchema = yup.object().shape({
        userId: yup.string().required("아이디를 입력하십시오"),
        email: yup.string().required("이메일을 입력하십시오"),
    });

    const sendEmailSchema = yup.object().shape({
        code: yup.string().required("인증 코드를 입력하십시오"),
    })

    const changePwSchema = yup.object().shape({
        newPassword: yup
        .string()
        .required("비밀번호를 입력하십시오")
        .min(6, "비밀번호는 최소 6자리 이상이어야 합니다"),
        confirmNewPassword: yup
        .string()
        .required("비밀번호를 확인하십시오")
        .oneOf([yup.ref("newPassword")], "비밀번호가 일치하지 않습니다"),
    });

    const findPwForm = useForm({
        resolver: yupResolver(findSchema),
    });
    const checkEmailForm = useForm({
        resolver: yupResolver(sendEmailSchema),
    })
    const changePwForm = useForm({
        resolver: yupResolver(changePwSchema),
    });

    // 이름, 이메일 확인, 이메일로 인증번호 전송
    const onFindPwSubmit = async (formData) => {
        await findPwMutation.mutateAsync(formData);
        setCheckPw(true);
        findPwForm.reset();
    };

    // 인증번호 확인
    const onConfirmEmailCodeSubmit = async(formData) => {
        await confirmEmailCodeMutation.mutateAsync(formData);
        setCheckCode(true);
    }

    // 비밀번호 변경
    const onPwChangeSubmit = async(formData) => {
        await newPwMutation.mutateAsync(formData);
        setShow(true);
        changePwForm.reset();
    }
    return (
        <>
            {!checkPw && (
                <form className={styles.user_loginp_wrap} onSubmit={findPwForm.handleSubmit(onFindPwSubmit)}>
                {findPwFields.map((field) => (
                    <InputForm
                    key={field.name}
                    {...field}
                    register={findPwForm.register}
                    error={findPwForm.formState.errors[field.name]}
                    />
                ))}

                <div className='long_btn_bg'>
                    <button
                        type="submit"
                        className='btn_50_b'>
                            비밀번호찾기
                    </button>
                </div>
            </form>
            )}
            {(checkPw && !checkCode) &&
            <form onSubmit={checkEmailForm.handleSubmit(onConfirmEmailCodeSubmit)}>
                <InputForm
                key={"email_01"}
                name={"code"}
                id={"code"}
                type={"text"}
                placeholder={"인증 코드를 입력하세요"}
                register={checkEmailForm.register}
                error={checkEmailForm.formState.errors["code"]}
                 />
                 <div className='long_btn_bg mt-4'>
                    <button type="submit" className="btn_50_b">이메일 인증</button>
                 </div>
            </form>
            }

            {(checkPw && checkCode) && (
                <form className={styles.user_loginp_wrap} onSubmit={changePwForm.handleSubmit(onPwChangeSubmit)} autoComplete="off">
                    <div className={styles.user_loginp_wrap}>
                        {chgPwFields.map((field) => (
                            <InputForm
                            key={field.name}
                            {...field}
                            register={changePwForm.register}
                            error={changePwForm.formState.errors[field.name]}
                            />
                        ))}
                    </div>
                    <div className='long_btn_bg'>
                        <button type="submit" className='btn_50_b'>비밀번호 변경</button>
                    </div>
                </form>
            )}
            {/* 모달 */}
            <ShowModal
                show={show}
                handleClose={handleClose}
                closeBtnName='닫기'
            >
                비밀번호가 변경되었습니다.<br />
                새 비밀번호로 로그인해 주세요.
            </ShowModal>
            
            {isLoading &&
                <Loading />
            }
        </>
    );
}

export default FindPw;
