import React from 'react';
import PropTypes from "prop-types";
import styles from '@/components/icon/eventIcon.module.css';

function EventIcon({ product, cssPosition="relative", top="0", left="0",
    name: customName,
    bgColor: customBgColor 
 }) {
    if ((!product || !product.promoType) && !customName) return null;

    let name = "";
    let bgColor = "one";

    if (customName) {
        name = customName;
        bgColor = customBgColor || "one"; // 사용자 정의 배경색 없으면 기본값
    }
    else if (product?.promoType) {
        switch(product.promoType) {
            case "ONE_PLUS_ONE":
                name = "1 + 1";
                bgColor = "one";
                break;
            case "TWO_PLUS_ONE":
                name = "2 + 1";
                bgColor = "two";
                break;
            case "GIFT":
                name = "덤 증정";
                bgColor = "one";
                break;
            case "NONE":
                name = "할인";
                bgColor = "one";
                break;
            default:
                name = "행사";
                bgColor = "one";
        }
    }
    const cssVar = `var(--${bgColor})`;

    if (!name) return null; // 이벤트 없는 경우 렌더링 안함

    return (
        <span 
            className={styles.event} 
            style={{
                backgroundColor: cssVar,
                position: cssPosition,
                top: top,
                left: left,
            }}
        >
            {name}
        </span>
    );
}

EventIcon.propTypes = {
    product: PropTypes.shape({
        promoType: PropTypes.oneOf(["ONE_PLUS_ONE", "TWO_PLUS_ONE", "GIFT", "NONE", "전체"])
    }).isRequired,
    cssPosition: PropTypes.oneOf(["absolute", "relative", "fixed", "static"]),
    top: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
    left: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
    name: PropTypes.string,
    bgColor: PropTypes.string,
}

export default EventIcon;
