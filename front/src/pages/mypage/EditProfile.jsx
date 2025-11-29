import { yupResolver } from "@hookform/resolvers/yup";
import React, { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { Link } from "react-router";
import * as yup from "yup";
import InputForm from "../../components/InputForm";
import BtnForm from "../../components/btn/BtnForm";
import styles from "@/pages/mypage/mypage.module.css";
import { useMypage } from "../../hooks/useMypage";
import { loadingStore } from "../../store/loadingStore";
import Loading from "../../components/Loading";

function EditProfile(props) {

    const [myInfo, setMyInfo] = useState(null);

    const [showPwForm, setShowPwForm] = useState(false);

    const isLoading = loadingStore(state => state.loading); // 요청에 대한 로딩 상태

    const myInfoSchema = yup.object().shape({
        username: yup.string().required("이름을 입력하십시오"),
        email: yup.string().email("올바른 이메일 형식이 아닙니다.").required("이메일을 입력하십시오."),
        phone: yup.string().required("휴대폰 번호를 입력하십시오")
            .matches(/^[0-9]+$/, "숫자만 입력 가능합니다")
            .min(10, "10자리 이상 입력해주세요")
            .max(11, "11자리 이하로 입력해주세요"),
        nickname: yup.string().required("닉네임을 입력하십시오"),
    });

    const pwSchema = yup.object().shape({
        newPassword: yup
        .string()
        .required("비밀번호를 입력하십시오")
        .min(6, "비밀번호는 최소 6자리 이상이어야 합니다"),
        confirmNewPassword: yup
        .string()
        .required("비밀번호를 확인하십시오")
        .oneOf([yup.ref("newPassword")], "비밀번호가 일치하지 않습니다"),       
    });

    const myInfoFrm = useForm({
        resolver: yupResolver(myInfoSchema),
        defaultValues: myInfo
    });

    const newPwForm = useForm({
        resolver: yupResolver(pwSchema),
        defaultValues: myInfo
    })

    const { getMyInfoMutation, setMyInfoMutation, newMypwMutation } = useMypage();


    const onSubmitMyInfo = async (formData) => {
        console.log("폼 데이터:", formData);
        await setMyInfoMutation.mutateAsync(formData);
        myInfoFrm.reset(formData);
    };

    const onSubmitNewPw = async (formData) => {
        console.log("폼 데이터:", formData);
        await newMypwMutation.mutateAsync(formData);
        setShowPwForm(false);
    }


    useEffect(() => {
        const fetchMyInfo = async () => {
            const result = await getMyInfoMutation.mutateAsync();
            setMyInfo(result);
        }
        fetchMyInfo();
    }, [])

    useEffect(() => {
        if (myInfo) {
            myInfoFrm.reset(myInfo); // myInfo가 바뀔 때 form에도 반영
        }
    }, [myInfo, myInfoFrm.reset]); 


    return (
        <>
        <div className={styles.point_cont}>
            <h3>내 정보 수정</h3>

            <div className={styles.form_cont}>
                {!showPwForm && 
                    <form action=""  onSubmit={myInfoFrm.handleSubmit(onSubmitMyInfo)}>
                        <section className={styles['user-loginp-wrap']}>
                            <InputForm
                                label="아이디"
                                type="text"
                                placeholder="아이디를 입력해주세요"
                                readOnly={true}
                                name="userId"
                                register={myInfoFrm.register}
                            />
                            <InputForm
                                label="이름"
                                type="text"
                                placeholder="이름을 입력해주세요"
                                readOnly={true}
                                name="username"
                                register={myInfoFrm.register}
                                error={myInfoFrm.formState.errors.username}
                            />
                            <InputForm
                                label="이메일"
                                type="text"
                                placeholder="이메일을 입력해주세요"
                                name="email"
                                register={myInfoFrm.register}
                                error={myInfoFrm.formState.errors.email}
                            />
                            <InputForm
                                label="휴대폰 번호"
                                type="text"
                                placeholder="휴대폰 번호를 입력해주세요"
                                name="phone"
                                register={myInfoFrm.register}
                                error={myInfoFrm.formState.errors.phone}
                            />
                            <InputForm
                                label="닉네임"
                                type="text"
                                placeholder="닉네임을 입력해주세요"
                                name="nickname"
                                register={myInfoFrm.register}
                                error={myInfoFrm.formState.errors.nickname}
                            />
                            <InputForm
                                label="생년월일"
                                type="date"
                                placeholder="생년월일을 입력해주세요"
                                name="birth"
                                register={myInfoFrm.register}
                                readOnly={true}
                            />
                        </section>
                        <div className={styles["btn_wrap"]}>
                            <BtnForm
                                type='submit'
                                className='btn_50_b w-100 mt-3'
                                btnName='수정'
                            />
                            <BtnForm
                                type="button"
                                className="btn_50_w w-100 mt-2"
                                btnName="비밀번호 변경"
                                onClick={() => setShowPwForm(true)}
                            />
                        </div>
                    </form>
                }


                {showPwForm && 
                    <form onSubmit={newPwForm.handleSubmit(onSubmitNewPw)}>
                        <section className={styles['user-loginp-wrap']}>
                            <InputForm
                                label="비밀번호"
                                type="password"
                                placeholder="새 비밀번호를 입력해주세요"
                                name="newPassword"
                                register={newPwForm.register}
                                error={newPwForm.formState.errors.newPassword}
                            />
                            <InputForm
                                label="비밀번호 확인"
                                type="password"
                                placeholder="새 비밀번호를 입력해주세요"
                                name="confirmNewPassword"
                                register={newPwForm.register}
                                error={newPwForm.formState.errors.confirmNewPassword}
                            />  
                        </section>
                        <div className={styles["btn_wrap"]}>
                            <BtnForm
                                type='submit'
                                className='btn_50_b w-100 mt-2'
                                btnName='수정'
                            />
                            <BtnForm
                                type='button'
                                className='btn_50_w w-100 mt-2'
                                onClick={() => setShowPwForm(false)}
                                btnName='내 정보 수정'
                            />
                        </div>                                      
                    </form>    
                }

            </div>

        </div>
        {isLoading &&
            <Loading />
        }
        </>
    );
}

export default EditProfile;