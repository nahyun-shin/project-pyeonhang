import React from 'react';

function BtnForm({btnName,type = "button",className='', disabled = false, onClick }) {

    const btnCount = ()=>{
        
    }
    return (
        
            <button 
                type={type} 
                className={className}
                disabled={disabled}
                onClick={onClick}
            >
                {btnName}
            </button>
        
    );
}

export default BtnForm;