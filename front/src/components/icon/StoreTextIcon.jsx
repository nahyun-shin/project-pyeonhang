import React from 'react';
import styles from '@/components/icon/storeIcon.module.css';
import PropTypes from 'prop-types';
import cuIcon from '../../assets/img/cu_icon.svg';
import gsIcon from '../../assets/img/gs25_icon.svg';
import sevenIcon from '../../assets/img/seven_icon.svg';

function StoreTextIcon({product, cssPosition="relative", top="", left="", bottom="",right="",width,height}) {
    // // 안전하게 문자열 정제 (공백, 대소문자 등 처리)
    if (!product) return "Unknown";
    const normalized = (product || "").toLowerCase().trim();

    // 매핑
    let name;
    let storeClass;
    switch (normalized) {
        case "cu":
            name = "CU"
            storeClass = styles._cu;
            break;

        case "gs25":
        case "gs":
            name = "GS25"
            storeClass = styles._gs25;
            break;

        case "7eleven":
        case "seveneleven":
        case "sev":
        case "7":
        case "7-eleven":
            name = "7ELEVEN"
            storeClass = styles._7eleven;
            break;

        default:
            storeClass = styles._default;
            break;
    }
    return (
        <span className={`${styles.text_category} ${storeClass}`}
            style={{
                width:width,
                height:height,
                position:cssPosition,
                top:top,
                bottom:bottom,
                left:left,
                right:right
            }}
        >
            {name}
        </span>
    );
}

StoreTextIcon.propTypes = {
    name: PropTypes.string.isRequired,
};

export default StoreTextIcon;
