import React, { useEffect, useState } from 'react';
import AdminTableList from '../../../components/admin/AdminTableList';
import CustomAlert from '../../../components/alert/CustomAlert';

function AdminCategory(props) {
    const [cateList, setCateList] = useState([]);

    const showAddCate = () => {
        setCateList(prev => [...prev, 
            {
                categoryCode: '', 
                categoryName: '', 
                useYn: 'Y',
                isCategory: true,
                btnText: '등록'
            }
        ])
    };

    const addCate = () => {
        CustomAlert({
          text: `카테고리가 등록되었습니다!`
      })
    };
    useEffect(() => {
        setCateList([
            {
                productType: 1,
                categoryCode: 'aaa',
                categoryName: '도시락', 
                useYn: 'Y'
            },
            {
                productType: 2,
                categoryCode: 'abb',
                categoryName: '신선식품', 
                useYn: 'Y'
            },
            {
                productType: 3,
                categoryCode: 'aab',
                categoryName: '과자류', 
                useYn: 'Y'
            },    
            {
                productType: 4,
                categoryCode: 'bbb',
                categoryName: '음료', 
                useYn: 'Y'
            },      
            {
                productType: 5,
                categoryCode: 'bbbc',
                categoryName: '아이스크림', 
                useYn: 'Y'
            },      
        ]);
    }, [])


    return (
        <div className='w-50 mx-auto mt-5'>
            <div className="btn_box text-end">
                <button type="button" className='btn btn-outline-dark px-3 me-2' onClick={showAddCate}>추가</button>
                <button type="button" className='btn btn-outline-danger px-3'>삭제</button>
            </div>
            <table className=" table mt-3" id="" name="" autocomplete='false'>
                <colgroup>
                    <col width="60px" />
                    <col width="70%" />
                </colgroup>
                <thead>
                    <tr className='text-center'>
                        <th></th>
                        <th>카테고리 이름</th>
                        <th>관리</th>
                    </tr>
                </thead>
                <tbody>
                    {cateList && cateList.map((cate, index) => {
                        return <AdminTableList isCategory={cate?.isCategory} id={`${cate}${index}`} text={cate.categoryName} onClick={""} btnText={cate.btnText} />
                    })}
                    
                </tbody>
            </table>
        </div>
    );
}

export default AdminCategory;