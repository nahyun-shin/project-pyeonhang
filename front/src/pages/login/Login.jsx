// import React, { useState } from "react";
import { Link, useNavigate } from "react-router";
import styles from '@/pages/login/login.module.css';
import * as yup from "yup";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import InputForm from "../../components/InputForm";
import { useState } from "react";
import { authStore } from "../../store/authStore";
import { loginApi } from "../../api/login/loginApi";
import { useLogin } from "../../hooks/useLogin";
import { loadingStore } from "../../store/loadingStore";
import Loading from "../../components/Loading";

const loginFields = [
  { label: "아이디", name: "username", type: "text", placeholder: "아이디를 입력하세요" },
  { label: "비밀번호", name: "password", type: "password", placeholder: "비밀번호를 입력하세요" },
];
function Login() {
    const { loginMutation }  = useLogin();
    
    const isLoading = loadingStore(state => state.loading); // 요청에 대한 로딩 상태

    const schema = yup.object().shape({
        username: yup.string().required("아이디를 입력하십시오"),
        password: yup.string().required("비밀번호를 입력하십시오"),
    });

    const {
        register,
        handleSubmit,
        formState: { errors },
        reset,
    } = useForm({
        resolver: yupResolver(schema),
        defaultValues: {
        username: "",
        password: ""
    }
    });

    const onSubmit = async (data) => {
        console.log("폼 데이터:", data);        
        await loginMutation.mutateAsync(data);
        reset();
    };
    return (
        <>
            <form  onSubmit={handleSubmit(onSubmit)}>
                {/* <section>
                    <div className={styles.userRole_wrap}>
                        <label>
                            <input
                            type="radio"
                            name="role"
                            value="user"
                            checked={role === "user"}
                            onChange={handleChange}
                            />
                            사용자
                        </label>

                        <label>
                            <input
                            type="radio"
                            name="role"
                            value="admin"
                            checked={role === "admin"}
                            onChange={handleChange}
                            />
                            관리자
                        </label>
                    </div>
                </section> */}

                <section className={styles.user_loginp_wrap}>
                    {loginFields.map((field) => (
                        <InputForm
                        key={field.name}
                        {...field}
                        register={register}
                        error={errors[field.name]}
                        />
                    ))}
                </section>

                <div className={styles.find_wrap}>
                    <Link to="/login/findId">아이디 찾기</Link>
                    <span> | </span>
                    <Link to="/login/findPw">비밀번호 찾기</Link>
                </div>

                <div className='long_btn_bg'>
                    <button type="submit" className="btn_50_b">로그인</button>
                    <Link to={"/login/signUp"} className="btn_50_w">회원가입</Link>
                </div>

            </form>
            {isLoading &&
                <Loading />
            }
        
        </>
    );
}

export default Login;
