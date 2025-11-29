import React from "react";
import styles from '@/pages/login/login.module.css';
import { Outlet, useLocation, useMatches } from "react-router";
import { pageInfo } from "../../hooks/pageTitle";

function LoginLayout() {

    const { pathname } = useLocation();
    const title = pageInfo[pathname]?.title || "";

    return (
        <div className={styles.login_bg}>
            <div className={styles.login_wrap}>
                <span className="page_title">{title}</span>

                <Outlet />
            </div>
        </div>
    );
}

export default LoginLayout;
