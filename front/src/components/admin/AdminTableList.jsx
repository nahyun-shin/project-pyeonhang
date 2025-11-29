import React from 'react';

function AdminList({isCategory = false, id, text, btnText="수정", onClick}) {
    return (
        <tr>
            <td>
                <input type="checkbox" className='align-middle mt-2 form-check' id={id} /> 
            </td>
            <td className='align-middle'>
                {isCategory ?
                    <input type="text" className='form-control' id={id} defaultValue={text} />
                    :
                    <label htmlFor={id}>{text}</label>
                }                
            </td>
            <td className='text-center'><button type="button" className='btn btn-dark px-3' onClick={onClick}>{btnText}</button></td>
        </tr>
    );
}

export default AdminList;