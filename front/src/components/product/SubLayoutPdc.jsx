
import { Link } from 'react-router';
import styles from "@/pages/main/main.module.css";
import Item from '../list/Item';
import plusIcon from '../../assets/img/plus.png';

function SubLayoutPdc({titleName, moreLink, children }) {
    return (
        <section className={`${styles.prd_section} ${styles.best_prd}`}>
            <div className={styles.main_title_bg}>
                <div className={styles.main_title_wrap}>
                    {titleName}
                    <img src={plusIcon} alt="아이콘" />
                </div>
                <Link to={moreLink}>더보기 {">"}</Link>
            </div>
            
                {children}
            
        </section>
    );
}

export default SubLayoutPdc;