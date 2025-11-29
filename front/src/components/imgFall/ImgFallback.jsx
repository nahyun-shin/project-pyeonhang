import React from 'react';
import empty from '../../assets/img/emptyLogo.png';

function ImgFallback({src,alt="",className=""}) {
    return (
        <img
            className={className}
            src={src || empty}
            alt={alt}
            onError={(e) => {
                e.target.onerror = null;
                e.target.src = empty;
            }}
        />
    );
}

export default ImgFallback;
