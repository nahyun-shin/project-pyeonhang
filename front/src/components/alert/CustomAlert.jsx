import React from 'react';
import Swal from 'sweetalert2';
import './customAlert.css';

const CustomAlert = ({
  title = '',
  text = '',
  width = '450px',
  padding = '2em',
  color = '#000000',
  background = '#ffffff',
  showCancelButton= false,
  confirmButtonText = '확인',
  cancelButtonText = '취소',
  backdrop = 'rgba(0,0,0,0.5)',
  customClass = {}               // 클래스 직접 적용
}) => {

  const isString = typeof text === 'string';
  
return Swal.fire({
    title,
    // 문자열이면 html로 변환해서 줄바꿈 지원
    ...(isString
      ? { html: text.replace(/\n/g, '<br/>') }
      : { text: JSON.stringify(text, null, 2) } // 객체/배열이면 text로 출력
    ),
    width,
    padding,
    color,
    background,
    showCancelButton,
    confirmButtonText,
    cancelButtonText,
    backdrop,
    customClass:{
        title: 'my-title',
        htmlContainer: 'my-content',
        confirmButton: 'my-btn',
        cancelButton:'my-btn-cancel'

    }
  }).then((result) => result.isConfirmed);
  
};

export default CustomAlert;