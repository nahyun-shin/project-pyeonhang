import React, { useEffect, useState } from 'react';
import styles from '../assets/css/header.module.css';
import logo from '../assets/img/logo.png';
import { Link, Navigate, NavLink, useLocation, useNavigate } from 'react-router';
import { authStore } from '../store/authStore';
import Navbar from 'react-bootstrap/Navbar';
import Nav from 'react-bootstrap/Nav';
import { NavDropdown } from 'react-bootstrap';
import { useQueryClient } from '@tanstack/react-query';

function Header(props) {
    const navigate = useNavigate();
    const { token, userRole, userName, clearAuth } = authStore();
    const isLoggedIn = !!token;
    const isAdmin = userRole === "ROLE_ADMIN";
    const queryClient = useQueryClient();
    
    const [isAdminPage, setIsAdminPage] = useState(false);

    const handleLogout = () => {
        clearAuth(); 
        queryClient.invalidateQueries(["wish"]);
        navigate("/main", { replace: true }); 
    };
    const location = useLocation();
    
    useEffect(() => {
        setIsAdminPage(location.pathname.split('/')[1] == 'admin');
    }, [location])
    
    return (
        <div className={styles.fixed_bg}>
            <header className={styles.header_bg}>
                <Navbar className={styles.header_nav}>
                    <div className={styles.l_menu_bg}>
                        <div className={styles.logo}>
                            <Link to={isAdmin?'/admin':'/'} >
                                <img src={logo} alt="편행로고"/>
                            </Link>
                        </div>

                        {/* 관리자가 아니거나, 관리자 페이지가 아닐 떄 노출 */}
                        {(!isAdmin || !isAdminPage) && (
                            <ul className={styles.l_menu_list}>
                                <li><NavLink to="/product/ALL" className={({isActive}) => isActive? styles.active:""}>전체상품</NavLink></li>
                                <li><NavLink to="/product/CU" className={({isActive}) => isActive? styles.active:""}>CU</NavLink></li>
                                <li><NavLink to="/product/GS25" className={({isActive}) => isActive? styles.active:""}>GS25</NavLink></li>
                                <li><NavLink to="/product/SEV" className={({isActive}) => isActive? styles.active:""}>7ELEVEN</NavLink></li>
                                <li><NavLink to="/board" className={({isActive}) => isActive? styles.active:""}>게시판</NavLink></li>
                                <li><NavLink to="/store" className={({isActive}) => isActive? styles.active:""}>매장찾기</NavLink></li>
                            </ul>
                        )}
                        {/* 관리자이고, 관리자 페이지일 때 노출 */}
                        {(isAdmin && isAdminPage) && (
                            <ul className={styles.l_menu_list}>
                                <li><NavLink to="/admin/product" className={({isActive}) => isActive? styles.active:""}>상품 관리</NavLink></li>
                                <li><NavLink to="/admin/user" className={({isActive}) => isActive? styles.active:""}>회원 관리</NavLink></li>
                                <li><NavLink to="/admin/board" className={({isActive}) => isActive? styles.active:""}>게시판 관리</NavLink></li>
                                {/* <li><NavLink to="/admin/category" className={({isActive}) => isActive? styles.active:""}>카테고리관리</NavLink></li> */}
                                <li><NavLink to="/admin/banner" className={({isActive}) => isActive? styles.active:""}>메인 배너 관리</NavLink></li>
                                <li><NavLink to="/admin/coupon/grant" className={({isActive}) => isActive? styles.active:""}>쿠폰 관리</NavLink></li>
                            </ul>
                        )}
                    </div>
                    <Navbar.Collapse className={`${styles.r_menu}`}>
                        {!isLoggedIn?
                        (
                                <Nav.Link as={NavLink} to="/login">로그인</Nav.Link>
                        )
                        :
                        (<>
                            <NavDropdown title={`${userName} 님`}>
                                {isAdmin ?
                                    <>
                                        {
                                            isAdminPage ? 
                                            <NavDropdown.Item as={Link} to="/">사용자 페이지</NavDropdown.Item>
                                            :
                                            <NavDropdown.Item as={Link} to="/admin">관리자 페이지</NavDropdown.Item>
                                        }
                                    </>
                                    :
                                    <>
                                        <NavDropdown.Item as={NavLink} to="/mypage">마이페이지</NavDropdown.Item>
                                    </>
                                }
                                <NavDropdown.Item onClick={handleLogout} >로그아웃</NavDropdown.Item>
                            </NavDropdown>
                        </>)
                        }
                    </Navbar.Collapse>
                </Navbar>
            </header>
        </div>
    );
}

export default Header;