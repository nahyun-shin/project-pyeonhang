import React from 'react';
import { Outlet, useLocation } from 'react-router';
import { pageInfo } from '../hooks/pageTitle';

function SubLayout(props) {
    const {pathname} = useLocation();
    const title = pageInfo[pathname]?.title || "";
    return (
        
        <div className='base_list_bg'>
            <span className="page_title">{title}</span>
            <Outlet/>
        </div>
        
    );
}

export default SubLayout;