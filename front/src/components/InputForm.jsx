import React, { useEffect, useState } from 'react';
import styles from '@/pages/login/login.module.css';

function InputForm({
  label,
  id='',
  type = "text",
  placeholder,
  register,
  name,
  error,
  readOnly = false,
  defaultValue,
  setValue,
  className = "",
}) {
  // 내부 상태는 useForm이 없을 때만 사용
  const [internalValue, setInternalValue] = useState(defaultValue || "");

  useEffect(() => {
    if (!register) {
      setInternalValue(defaultValue || "");
    }
  }, [defaultValue, register]);

  const handleChange = (e) => {
    const value = e.target.value;
    setInternalValue(value);
    if (setValue) setValue(e);
  };

  // useForm 사용 여부 확인
  const isUseForm = !!(register && name);

  // useForm 사용 시 register의 반환값을 가져옴
  const registerProps = isUseForm ? register(name) : {};

  return (
    <div className={`${styles.user_loginp} ${className}`}>
      <label>{label}</label>
      <input
        id={id}
        type={type}
        readOnly={readOnly}
        placeholder={placeholder}
        {...registerProps} // register 값 자체를 넣어줌
        className="form-control"
        {...(!isUseForm && {
          value: internalValue,
          onChange: handleChange
        })} //value,onChange에 조건문으로 걸러서 useForm의 값과 덮어씌워지지 않게 하기
        onWheel={(e) => e.target.blur()} //numberInput으로 설정 시 휠로 값이 설정되는거 막음
      />
      {error && <p className="error-msg">{error.message}</p>}
    </div>
  );
}

export default InputForm;
