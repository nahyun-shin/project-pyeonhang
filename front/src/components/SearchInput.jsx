import React, { useEffect, useState } from 'react';
import searchbtn from "../assets/img/search_btn.svg";
import { IoSearch } from "react-icons/io5";

function SearchInput({value, onChange}) {
    const [input, setInput] = useState(value);

    // 부모 값이 바뀌면 input도 업데이트
    useEffect(() => {
        setInput(value);
    }, [value]);

    const handleSubmit = (e) => {
        e.preventDefault();
        onChange(input); // 부모로 이벤트 전달
    };
    return (
        <form className='search_box' onSubmit={handleSubmit}>
            
            <input 
                type="text" 
                name="search" 
                id="search" 
                className='search_input' 
                value={input}
                onChange={(e)=>setInput(e.target.value)}
            />
            <button type="submit">
                <IoSearch className='search_icon'/>
            </button>
        </form>
    );
}

export default SearchInput;