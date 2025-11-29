import React, { useEffect, useState } from 'react';
import Map from '../../components/map/Map';
import "@/pages/store/store.css";
import StoreIcon from '../../components/icon/StoreIcon';
import { IoSearch } from 'react-icons/io5';
import StoreTextIcon from '../../components/icon/StoreTextIcon';
import { loadingStore } from '../../store/loadingStore';
import Loading from '../../components/Loading';

function Store(props) {

    const [chainName, setChainName] = useState("all");
    const [inputText, setInputText] = useState("");
    const [searchText, setSearchText] = useState('');
    const [list, setList] = useState([]); // 지도에 보여진 편의점 리스트
    const [toggle, setToggle] = useState(false);
    const [selectedItem, setSelectedItem] = useState(null);
    const [activeId, setActiveId] = useState('');

    const isLoading = loadingStore(state => state.loading); // 요청에 대한 로딩 상태

    const filter = (e) => {
        setChainName(e.target.value);
    }

    const search = (e) => {
        // 엔터 입력 시
        if(e.keyCode == 13) {
            setSearchText(inputText);
        }
    }

    const listClick = (item) => {
        setSelectedItem({...item});
        setActiveId(item.id);
    }

    return (
        <>
        <div className='store_cont'>
            <div className={`option_cont ${toggle ? 'on' : ''}`}>
                <div className="option_box">
                    <div className="search_box">
                        <div className='search_box'>
                            <input type="text" name="search" id="search" className='search_input'
                                onChange={(e) => setInputText(e.target.value)}
                                onKeyDown={search}
                            />
                            <button type="button" onClick={() => setSearchText(inputText)}>
                                <IoSearch className='search_icon'/>
                            </button>
                        </div>
                    </div>
                    <ul className="chain_list">
                        <li>
                            <input type="radio" name="chain" id="chainAll" value="all" checked={chainName == "all" && true} onChange={filter} />
                            <label htmlFor="chainAll">
                                전체
                            </label>
                        </li>
                        <li>
                            <input type="radio" name="chain" id="cu" value="CU" checked={chainName == "CU" && true} onChange={filter} />
                            <label htmlFor="cu">
                                CU
                            </label>
                        </li>
                        <li>
                            <input type="radio" name="chain" id="gs25" value="GS25" checked={chainName == "GS25" && true} onChange={filter} />
                            <label htmlFor="gs25">
                                GS25
                            </label>
                        </li> 
                        <li>
                            <input type="radio" name="chain" id="7eleven" value="세븐일레븐" checked={chainName == "세븐일레븐" && true} onChange={filter} />
                            <label htmlFor="7eleven">
                                7ELEVEN
                            </label>
                        </li>                            
                    </ul>

                    <div className="search_list_cont">
                        <ul className='search_list'>
                            {list?.length > 0 && list.map((item, index) => {
                                 console.log(item);
                                 const cateNameArr = item.category_name.split(' > ');
                                 const chainName = cateNameArr[cateNameArr.length - 1];
                                return <li key={`${chainName}${item.id}${index}`} onClick={() => listClick(item)} className={activeId === item.id ? "active" : ""}>
                                    <StoreIcon
                                        product={chainName}
                                    />
                                    <div>
                                        <p className="title">
                                            {item.place_name}
                                        </p>
                                        <p className="addr">
                                            {item.road_address_name}
                                        </p>
                                        {item.phone && 
                                            <p className="call">
                                                {item.phone}
                                            </p>
                                        }
                                    </div>
                                    
                                    
                                </li>
                            })}
                        </ul>
                    </div>
                </div>
                <button type="button" className='box_toggle_btn' onClick={() => setToggle(prev => !prev)}>
                    <i className={`bi bi-caret-${toggle ? 'right' : 'left'}-fill`}></i>
                </button>                
            </div>

            <Map chainName={chainName} searchText={searchText} setList={setList} height={"calc(100vh - 100px)"} selectedItem={selectedItem} />
        </div>
        {isLoading &&
                <Loading />
            }
        </>
        
    );
}

export default Store;