import React from 'react';
import loadingBar from "../assets/img/footerLogo.png";

function Loading() {
    return (
        <div className="loading_box">
            <div className="loading_bg"></div>

            <div className="loading">
                <div className="logo_mask"></div>
                <div className="wave"></div>

            </div>
        </div>
    );
}

export default Loading;