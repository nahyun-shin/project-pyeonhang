import React, { useEffect, useMemo, useState } from 'react';
import { Container, Row, Col } from 'react-bootstrap';
import { Link, Outlet, useParams, useNavigate, useLocation } from 'react-router';
import styles from "@/pages/product/product.module.css";
import activeIcon from "../../assets/img/sub_cate_active.svg";
// import activeIcon from "../../assets/img/plus.png";
import { pageInfo } from '../../hooks/pageTitle';

function Layout() {
    const location = useLocation();
    const titleName = location.pathname.split('/').slice(0, 3).join('/');
    const title = pageInfo[titleName]?.title || "";
    const { sourceChain, promoType, productType } = useParams();

    // Detail 페이지 여부
    const isDetail = useMemo(() => location.pathname.split('/').length > 4, [location.pathname]);
    
    // 모든 값 null이면 ALL로
    const chainId = sourceChain?.toUpperCase() || 'ALL';
    const promoId = promoType?.toUpperCase() || 'ALL';
    const categoryId = productType?.toUpperCase() || 'ALL';
    
    //outlet에 넘겨줄 값
    const outletContext = { chainId, promoId, categoryId };

    // 행사 목록
    const promoList = useMemo(() => {
        const list = [
            { id: 'ALL', name: '전체상품' },
            { id: 'ONE_PLUS_ONE', name: '1+1 행사' },
            { id: 'TWO_PLUS_ONE', name: '2+1 행사' },
        ];
        if (chainId === 'GS25' || chainId === 'SEV') {
            list.push({ id: 'GIFT', name: '덤 증정' });
            if (chainId === 'SEV') list.push({ id: 'NONE', name: '할인 행사' });
        }
        return list;
    }, [chainId]);

    // 카테고리 목록
    const categoryList = useMemo(() => [
        { id: 'ALL', name: '전체' },
        { id: 'SNACK', name: '과자' },
        { id: 'DRINK', name: '음료' },
        { id: 'FOOD', name: '식품' },
        { id: 'LIFE', name: '생활용품' },
    ], []);


    return (
        <Container className={styles.product_cont}>
            <h2 className={`${styles.title_wrapper} ${styles[title]}`}>{title}</h2>

            <ul className={styles.category_list}>
                {promoList.map((promo) => (
                    <li
                        key={promo.id}
                        className={outletContext.promoId === promo.id ? styles.active : ''}
                    >
                        <Link to={`/product/${chainId}/${promo.id}/ALL`}>{promo.name}</Link>
                    </li>
                ))}
            </ul>

            <Row className={styles.contents}>
                <Col xs={2}>
                    <ul className={`${styles.sub_category_list} ${isDetail ? styles.detail : ''}`}>
                        {categoryList.map((cate) => (

                            <li
                                key={cate.id}
                                className={outletContext.categoryId === cate.id ? styles.active : ''}
                            >
                                <Link to={`/product/${chainId}/${promoId}/${cate.id}`}>
                                    {cate.name}
                                    {outletContext.categoryId === cate.id && (
                                        <img src={activeIcon} alt="active" />
                                    )}
                                </Link>

                            </li>
                        ))}
                    </ul>
                </Col>
                <Col xs={10}>
                    <Outlet context={outletContext} />
                </Col>
            </Row>
        </Container>
    );
}

export default Layout;
