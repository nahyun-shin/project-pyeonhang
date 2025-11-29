import React from 'react';import { Navbar } from 'react-bootstrap';
import { Link } from 'react-router';
import footLogo from '../assets/img/footerLogo.png';
import styles from '../assets/css/footer.module.css';


function Footer(props) {
    return (
        <>
            <div className={styles.footer_bg}>
                <div className={styles.footer_body}>
                    <section className={styles.foot_text_body}>
                        <span>개인정보처리방침 | 비회원 적립 서비스 이용 안내서 | 이메일무단수집거부 </span>
                    </section>
                    <Link to="/" className={styles.foot_logo}>
                        <img src={footLogo} alt="편행로고" />
                    </Link>
                </div>
            </div>
        </>
    );
}

export default Footer;